// Database Manager - IndexedDB para almacenamiento persistente
class DBManager {
  constructor() {
    this.dbName = 'MisNombramientosDB';
    this.version = 1;
    this.db = null;
  }

  // Inicializar la base de datos
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error al abrir la base de datos');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Base de datos inicializada correctamente');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Object Store para Nombramientos
        if (!db.objectStoreNames.contains('nombramientos')) {
          const nombramientosStore = db.createObjectStore('nombramientos', {
            keyPath: 'id',
            autoIncrement: true
          });
          nombramientosStore.createIndex('fechaDesde', 'fechaDesde', { unique: false });
          nombramientosStore.createIndex('fechaHasta', 'fechaHasta', { unique: false });
          nombramientosStore.createIndex('lugar', 'lugar', { unique: false });
          nombramientosStore.createIndex('tipoNombramiento', 'tipoNombramiento', { unique: false });
          nombramientosStore.createIndex('estado', 'estado', { unique: false });
        }

        // Object Store para Historial de Cambios
        if (!db.objectStoreNames.contains('historial')) {
          const historialStore = db.createObjectStore('historial', {
            keyPath: 'id',
            autoIncrement: true
          });
          historialStore.createIndex('timestamp', 'timestamp', { unique: false });
          historialStore.createIndex('accion', 'accion', { unique: false });
          historialStore.createIndex('nombramientoId', 'nombramientoId', { unique: false });
        }

        // Object Store para Configuración
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'key' });
        }
      };
    });
  }

  // CRUD para Nombramientos
  async addNombramiento(nombramiento) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readwrite');
      const store = transaction.objectStore('nombramientos');

      // Añadir timestamps y estado
      nombramiento.createdAt = new Date().toISOString();
      nombramiento.updatedAt = new Date().toISOString();
      nombramiento.estado = this.calcularEstado(nombramiento);

      const request = store.add(nombramiento);

      request.onsuccess = () => {
        nombramiento.id = request.result;
        // Registrar en historial
        this.addHistorial({
          accion: 'crear',
          nombramientoId: nombramiento.id,
          detalles: `Nombramiento creado en ${nombramiento.lugar}`,
          datos: nombramiento
        });
        resolve(nombramiento);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateNombramiento(id, updates) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readwrite');
      const store = transaction.objectStore('nombramientos');

      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const nombramiento = getRequest.result;
        if (!nombramiento) {
          reject(new Error('Nombramiento no encontrado'));
          return;
        }

        // Guardar datos antiguos para historial
        const datosAntiguos = { ...nombramiento };

        // Aplicar actualizaciones
        Object.assign(nombramiento, updates);
        nombramiento.updatedAt = new Date().toISOString();
        nombramiento.estado = this.calcularEstado(nombramiento);

        const updateRequest = store.put(nombramiento);

        updateRequest.onsuccess = () => {
          // Registrar en historial
          this.addHistorial({
            accion: 'editar',
            nombramientoId: id,
            detalles: `Nombramiento actualizado`,
            datos: nombramiento,
            datosAntiguos: datosAntiguos
          });
          resolve(nombramiento);
        };

        updateRequest.onerror = () => reject(updateRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteNombramiento(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readwrite');
      const store = transaction.objectStore('nombramientos');

      // Primero obtener los datos para el historial
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const nombramiento = getRequest.result;
        if (!nombramiento) {
          reject(new Error('Nombramiento no encontrado'));
          return;
        }

        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
          // Registrar en historial
          this.addHistorial({
            accion: 'eliminar',
            nombramientoId: id,
            detalles: `Nombramiento eliminado: ${nombramiento.lugar}`,
            datos: nombramiento
          });
          resolve();
        };

        deleteRequest.onerror = () => reject(deleteRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getNombramiento(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readonly');
      const store = transaction.objectStore('nombramientos');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllNombramientos() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readonly');
      const store = transaction.objectStore('nombramientos');
      const request = store.getAll();

      request.onsuccess = () => {
        const nombramientos = request.result.map(n => {
          n.estado = this.calcularEstado(n);
          return n;
        });
        resolve(nombramientos);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Prorrogar nombramiento
  async prorrogarNombramiento(id, nuevaFechaHasta, notas) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['nombramientos'], 'readwrite');
      const store = transaction.objectStore('nombramientos');

      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const nombramiento = getRequest.result;
        if (!nombramiento) {
          reject(new Error('Nombramiento no encontrado'));
          return;
        }

        const fechaAntiguaHasta = nombramiento.fechaHasta;
        
        // Actualizar fecha
        nombramiento.fechaHasta = nuevaFechaHasta;
        nombramiento.updatedAt = new Date().toISOString();
        nombramiento.estado = this.calcularEstado(nombramiento);
        
        // Agregar registro de prórroga
        if (!nombramiento.prorrogas) {
          nombramiento.prorrogas = [];
        }
        nombramiento.prorrogas.push({
          fechaAnterior: fechaAntiguaHasta,
          fechaNueva: nuevaFechaHasta,
          fecha: new Date().toISOString(),
          notas: notas
        });

        // Recalcular días totales
        const diasTotales = this.calcularDias(nombramiento.fechaDesde, nuevaFechaHasta);
        nombramiento.diasTotales = diasTotales;

        const updateRequest = store.put(nombramiento);

        updateRequest.onsuccess = () => {
          // Registrar en historial
          this.addHistorial({
            accion: 'prorrogar',
            nombramientoId: id,
            detalles: `Prórroga aplicada. Nueva fecha hasta: ${nuevaFechaHasta}`,
            datos: {
              fechaAnterior: fechaAntiguaHasta,
              fechaNueva: nuevaFechaHasta,
              notas: notas
            }
          });
          resolve(nombramiento);
        };

        updateRequest.onerror = () => reject(updateRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Historial
  async addHistorial(registro) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['historial'], 'readwrite');
      const store = transaction.objectStore('historial');

      registro.timestamp = new Date().toISOString();
      const request = store.add(registro);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllHistorial() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['historial'], 'readonly');
      const store = transaction.objectStore('historial');
      const request = store.getAll();

      request.onsuccess = () => {
        // Ordenar por fecha descendente
        const historial = request.result.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        resolve(historial);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Configuración
  async setConfig(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['config'], 'readwrite');
      const store = transaction.objectStore('config');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getConfig(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['config'], 'readonly');
      const store = transaction.objectStore('config');
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Utilidades
  calcularDias(fechaDesde, fechaHasta) {
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);
    const diffTime = Math.abs(hasta - desde);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
    return diffDays;
  }

  calcularEstado(nombramiento) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaHasta = new Date(nombramiento.fechaHasta);
    fechaHasta.setHours(0, 0, 0, 0);
    
    const diffTime = fechaHasta - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'vencido';
    } else if (diffDays <= 15) {
      return 'proximo'; // Próximo a vencer (15 días o menos)
    } else {
      return 'activo';
    }
  }

  // Obtener nombramientos próximos a vencer
  async getNombramientosProximosVencer() {
    const nombramientos = await this.getAllNombramientos();
    return nombramientos.filter(n => n.estado === 'proximo');
  }

  // Estadísticas
  async getEstadisticas(periodo = 'all', fechaDesde = null, fechaHasta = null) {
    const nombramientos = await this.getAllNombramientos();
    
    // Filtrar por período
    let nombramientosFiltrados = nombramientos;
    
    if (periodo === 'year') {
      const añoActual = new Date().getFullYear();
      nombramientosFiltrados = nombramientos.filter(n => {
        const año = new Date(n.fechaDesde).getFullYear();
        return año === añoActual;
      });
    } else if (periodo === 'month') {
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      nombramientosFiltrados = nombramientos.filter(n => {
        const fecha = new Date(n.fechaDesde);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      });
    } else if (periodo === 'custom' && fechaDesde && fechaHasta) {
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      nombramientosFiltrados = nombramientos.filter(n => {
        const fecha = new Date(n.fechaDesde);
        return fecha >= desde && fecha <= hasta;
      });
    }

    // Calcular estadísticas
    const totalNombramientos = nombramientosFiltrados.length;
    const totalDias = nombramientosFiltrados.reduce((sum, n) => sum + (n.diasTotales || 0), 0);
    const horasExtras = nombramientosFiltrados.reduce((sum, n) => {
      if (n.horasExtras && n.horasExtras.length > 0) {
        return sum + n.horasExtras.reduce((subSum, he) => subSum + (he.horas || 0), 0);
      }
      return sum;
    }, 0);
    const proximosVencer = nombramientos.filter(n => n.estado === 'proximo').length;

    // Por mes
    const porMes = {};
    nombramientosFiltrados.forEach(n => {
      const mes = new Date(n.fechaDesde).toLocaleDateString('es-CR', { month: 'short', year: 'numeric' });
      porMes[mes] = (porMes[mes] || 0) + 1;
    });

    // Por tipo
    const porTipo = {};
    nombramientosFiltrados.forEach(n => {
      const tipo = n.tipoNombramiento || 'Sin especificar';
      porTipo[tipo] = (porTipo[tipo] || 0) + 1;
    });

    // Por lugar
    const porLugar = {};
    nombramientosFiltrados.forEach(n => {
      const lugar = n.lugar || 'Sin especificar';
      porLugar[lugar] = (porLugar[lugar] || 0) + 1;
    });

    // Horas extras por mes
    const horasExtrasPorMes = {};
    nombramientosFiltrados.forEach(n => {
      if (n.horasExtras && n.horasExtras.length > 0) {
        n.horasExtras.forEach(he => {
          const mes = new Date(he.fecha).toLocaleDateString('es-CR', { month: 'short', year: 'numeric' });
          horasExtrasPorMes[mes] = (horasExtrasPorMes[mes] || 0) + (he.horas || 0);
        });
      }
    });

    return {
      totalNombramientos,
      totalDias,
      horasExtras,
      proximosVencer,
      porMes,
      porTipo,
      porLugar,
      horasExtrasPorMes,
      nombramientos: nombramientosFiltrados
    };
  }

  // Backup y Restauración
  async exportData() {
    const nombramientos = await this.getAllNombramientos();
    const historial = await this.getAllHistorial();
    
    return {
      version: this.version,
      exportDate: new Date().toISOString(),
      nombramientos,
      historial
    };
  }

  async importData(data) {
    if (!data.nombramientos || !Array.isArray(data.nombramientos)) {
      throw new Error('Formato de datos inválido');
    }

    // Limpiar datos existentes (opcional)
    // await this.clearAllData();

    // Importar nombramientos
    for (const nombramiento of data.nombramientos) {
      await this.addNombramiento(nombramiento);
    }

    // Importar historial si existe
    if (data.historial && Array.isArray(data.historial)) {
      for (const registro of data.historial) {
        await this.addHistorial(registro);
      }
    }
  }

  async clearAllData() {
    const stores = ['nombramientos', 'historial', 'config'];
    
    for (const storeName of stores) {
      await new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
}

// Instancia global
const dbManager = new DBManager();
