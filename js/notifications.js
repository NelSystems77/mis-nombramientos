// Notification Manager
class NotificationManager {
  constructor() {
    this.container = null;
    this.notificationQueue = [];
    this.maxNotifications = 5;
  }

  init() {
    this.container = document.getElementById('notifications');
    this.checkPermissions();
    this.scheduleExpirationCheck();
  }

  // Verificar permisos para notificaciones push
  async checkPermissions() {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return;
    }

    if (Notification.permission === 'default') {
      // Esperar a que el usuario interactúe antes de pedir permisos
      console.log('Permisos de notificación pendientes');
    } else if (Notification.permission === 'granted') {
      console.log('Permisos de notificación concedidos');
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Mostrar notificación en pantalla
  show(message, type = 'info', duration = 5000) {
    const notification = this.createNotification(message, type);
    
    if (!this.container) {
      this.init();
    }

    this.container.appendChild(notification);
    this.notificationQueue.push(notification);

    // Limitar número de notificaciones visibles
    if (this.notificationQueue.length > this.maxNotifications) {
      const oldest = this.notificationQueue.shift();
      this.removeNotification(oldest);
    }

    // Auto-cerrar
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }

    return notification;
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        <div class="notification-title">${titles[type] || titles.info}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">&times;</button>
    `;

    // Event listener para cerrar
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.removeNotification(notification);
    });

    return notification;
  }

  removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
      const index = this.notificationQueue.indexOf(notification);
      if (index > -1) {
        this.notificationQueue.splice(index, 1);
      }
    }, 300);
  }

  success(message, duration = 5000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 7000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 6000) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    this.show(message, 'info', duration);
  }

  // Notificación Push del navegador
  async showPushNotification(title, options = {}) {
    if (!('Notification' in window)) {
      console.log('Notificaciones push no soportadas');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (!permission) {
        console.log('Permisos de notificación denegados');
        return;
      }
    }

    const notification = new Notification(title, {
      icon: '/assets/logo.png',
      badge: '/assets/logo.png',
      vibrate: [200, 100, 200],
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }

  // Verificar nombramientos próximos a vencer
  async checkExpiringNombramientos() {
    try {
      const nombramientos = await dbManager.getNombramientosProximosVencer();
      
      if (nombramientos.length > 0) {
        // Notificación en pantalla
        this.warning(
          `Tienes ${nombramientos.length} nombramiento(s) próximo(s) a vencer`,
          8000
        );

        // Notificación push si está habilitada
        if (Notification.permission === 'granted') {
          const plural = nombramientos.length > 1 ? 's' : '';
          await this.showPushNotification(
            'Nombramientos próximos a vencer',
            {
              body: `Tienes ${nombramientos.length} nombramiento${plural} que vencerá${plural} en los próximos 15 días`,
              tag: 'expiring-nombramientos',
              requireInteraction: true
            }
          );
        }
      }

      return nombramientos;
    } catch (error) {
      console.error('Error al verificar nombramientos:', error);
      return [];
    }
  }

  // Programar verificación periódica
  scheduleExpirationCheck() {
    // Verificar al cargar
    setTimeout(() => {
      this.checkExpiringNombramientos();
    }, 2000);

    // Verificar cada 6 horas
    setInterval(() => {
      this.checkExpiringNombramientos();
    }, 6 * 60 * 60 * 1000);

    // Verificar diariamente a las 9 AM
    this.scheduleDailyCheck();
  }

  scheduleDailyCheck() {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(9, 0, 0, 0);

    // Si ya pasó hoy, programar para mañana
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilCheck = targetTime - now;

    setTimeout(() => {
      this.checkExpiringNombramientos();
      // Reprogramar para el día siguiente
      this.scheduleDailyCheck();
    }, timeUntilCheck);
  }

  // Confirmar acción
  async confirm(message, title = '¿Estás seguro?') {
    return new Promise((resolve) => {
      // Crear modal de confirmación personalizado
      const modal = document.createElement('div');
      modal.className = 'modal active';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
          <div class="modal-header">
            <h2>${title}</h2>
          </div>
          <div class="modal-body">
            <p style="margin: 1rem 0;">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" data-action="cancel">Cancelar</button>
            <button class="btn-primary" data-action="confirm">Confirmar</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const handleAction = (confirmed) => {
        modal.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
        resolve(confirmed);
      };

      modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        handleAction(false);
      });

      modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
        handleAction(true);
      });

      // Cerrar al hacer clic fuera
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          handleAction(false);
        }
      });
    });
  }
}

// Instancia global
const notificationManager = new NotificationManager();
