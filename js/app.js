// Main Application Controller
class App {
  constructor() {
    this.currentView = 'dashboard';
    this.currentNombramiento = null;
    this.horasExtrasCounter = 0;
    this.horarios = {
  '10pm-6am': { entrada: '22:00', salida: '06:00' },
  '6am-3pm': { entrada: '06:00', salida: '15:00' },
  '7am-4pm': { entrada: '07:00', salida: '16:00' },
  '8am-5pm': { entrada: '08:00', salida: '17:00' },
  '2pm-10pm': { entrada: '14:00', salida: '22:00' },
  '4pm-10pm': { entrada: '16:00', salida: '22:00' }
};
    this.theme = 'light';
    this.currentFilter = null; // Para filtros especiales del dashboard
  }

  async init() {
    try {
      // Mostrar loading
      this.showLoading(true);

      // Inicializar base de datos
      await dbManager.init();
      
      // Inicializar managers
      notificationManager.init();
      
      // Cargar tema guardado
      await this.loadTheme();
      
      // Actualizar saludo del usuario
      await this.updateUserGreeting();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Cargar vista inicial
      await this.loadDashboard();
      
      // Ocultar loading
      this.showLoading(false);
      
      console.log('Aplicación inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      notificationManager.error('Error al inicializar la aplicación');
      this.showLoading(false);
    }
  }
  

  setupEventListeners() {
    // Navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Horario preset change
const horarioPreset = document.getElementById('horarioPreset');
if (horarioPreset) {
  horarioPreset.addEventListener('change', (e) => {
    const value = e.target.value;
    const customFields = document.getElementById('horarioCustomFields');
    const horaEntrada = document.getElementById('horaEntrada');
    const horaSalida = document.getElementById('horaSalida');
    
    if (value === 'otro') {
      // Mostrar campos personalizados
      customFields.style.display = 'block';
      horaEntrada.required = true;
      horaSalida.required = true;
      document.getElementById('horarioPreview').innerHTML = '';
    } else if (value && this.horarios[value]) {
      // Usar horario predefinido
      customFields.style.display = 'none';
      horaEntrada.required = false;
      horaSalida.required = false;
      
      const horario = this.horarios[value];
      horaEntrada.value = horario.entrada;
      horaSalida.value = horario.salida;
      
      this.updateHorarioPreview(horario.entrada, horario.salida);
    } else {
      customFields.style.display = 'none';
      horaEntrada.required = false;
      horaSalida.required = false;
      horaEntrada.value = '';
      horaSalida.value = '';
      document.getElementById('horarioPreview').innerHTML = '';
    }
  });
}

// Cambios en campos de hora personalizados
const horaEntrada = document.getElementById('horaEntrada');
const horaSalida = document.getElementById('horaSalida');
if (horaEntrada && horaSalida) {
  horaEntrada.addEventListener('change', () => {
    if (horaEntrada.value && horaSalida.value) {
      this.updateHorarioPreview(horaEntrada.value, horaSalida.value);
    }
  });
  
  horaSalida.addEventListener('change', () => {
    if (horaEntrada.value && horaSalida.value) {
      this.updateHorarioPreview(horaEntrada.value, horaSalida.value);
    }
  });
}
    
    // Botón instalar PWA
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (window.installApp) {
          window.installApp();
        }
      });
    }

    // Toggle tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Perfil de usuario
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => this.openProfileModal());
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
    }

    // Nuevo nombramiento
    const btnNuevo = document.getElementById('btnNuevoNombramiento');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => this.openNombramientoModal());
    }

    // Formulario nombramiento
    const form = document.getElementById('nombramientoForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleNombramientoSubmit(e));
    }

    // Formulario prórroga
    const prorrogaForm = document.getElementById('prorrogaForm');
    if (prorrogaForm) {
      prorrogaForm.addEventListener('submit', (e) => this.handleProrrogaSubmit(e));
    }

    // Cerrar modales
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Cerrar modal al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Cambio de tipo de lugar
    const tipoLugar = document.getElementById('tipoLugar');
    if (tipoLugar) {
      tipoLugar.addEventListener('change', (e) => this.loadLugares(e.target.value));
    }

    // Cambio de tipo de nombramiento
    const tipoNombramiento = document.getElementById('tipoNombramiento');
    if (tipoNombramiento) {
      tipoNombramiento.addEventListener('change', (e) => {
        const otroContainer = document.getElementById('otroTipoContainer');
        if (e.target.value === 'otro') {
          otroContainer.style.display = 'block';
          document.getElementById('otroTipo').required = true;
        } else {
          otroContainer.style.display = 'none';
          document.getElementById('otroTipo').required = false;
        }
      });
    }

    // Cambio de fechas
    const fechaDesde = document.getElementById('fechaDesde');
    const fechaHasta = document.getElementById('fechaHasta');
    if (fechaDesde) {
      fechaDesde.addEventListener('change', () => this.calculateDias());
    }
    if (fechaHasta) {
      fechaHasta.addEventListener('change', () => this.calculateDias());
    }

    // Checkbox horas extras
    const checkHorasExtras = document.getElementById('tieneHorasExtras');
    if (checkHorasExtras) {
      checkHorasExtras.addEventListener('change', (e) => {
        const container = document.getElementById('horasExtrasContainer');
        container.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked && !document.querySelector('.hora-extra-item')) {
          this.addHoraExtraField();
        }
      });
    }

    // Agregar hora extra
    const btnAgregarHoras = document.getElementById('btnAgregarHoras');
    if (btnAgregarHoras) {
      btnAgregarHoras.addEventListener('click', () => this.addHoraExtraField());
    }

    // Búsqueda de puestos
    const puestoSearch = document.getElementById('puestoSearch');
    if (puestoSearch) {
      puestoSearch.addEventListener('input', (e) => this.searchPuestos(e.target.value));
      puestoSearch.addEventListener('blur', () => {
        setTimeout(() => {
          document.getElementById('puestoSuggestions').classList.remove('active');
        }, 200);
      });
    }

    // Filtros - Nombramientos
    const searchNombramientos = document.getElementById('searchNombramientos');
    if (searchNombramientos) {
      searchNombramientos.addEventListener('input', () => this.filterNombramientos());
    }

    const filterTipo = document.getElementById('filterTipo');
    if (filterTipo) {
      filterTipo.addEventListener('change', () => this.filterNombramientos());
    }

    const filterLugar = document.getElementById('filterLugar');
    if (filterLugar) {
      filterLugar.addEventListener('change', () => this.filterNombramientos());
    }

    const filterEstado = document.getElementById('filterEstado');
    if (filterEstado) {
      filterEstado.addEventListener('change', () => this.filterNombramientos());
    }

    // Botón limpiar filtros
    const btnClearFilters = document.getElementById('btnClearFilters');
    if (btnClearFilters) {
      btnClearFilters.addEventListener('click', () => this.clearFilters());
    }

    // Filtros - Historial
    const searchHistorial = document.getElementById('searchHistorial');
    if (searchHistorial) {
      searchHistorial.addEventListener('input', () => this.filterHistorial());
    }

    const filterAccion = document.getElementById('filterAccion');
    if (filterAccion) {
      filterAccion.addEventListener('change', () => this.filterHistorial());
    }

    // Dashboard - Tarjetas clickeables
    document.querySelectorAll('.stat-card.clickable').forEach(card => {
      card.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleDashboardCardClick(action);
      });
    });

    // Dashboard - Período
    const dashboardPeriod = document.getElementById('dashboardPeriod');
    if (dashboardPeriod) {
      dashboardPeriod.addEventListener('change', () => this.updateDashboard());
    }

    // Reportes
    const reportPeriod = document.getElementById('reportPeriod');
    if (reportPeriod) {
      reportPeriod.addEventListener('change', (e) => {
        const customRange = document.getElementById('customDateRange');
        customRange.style.display = e.target.value === 'custom' ? 'grid' : 'none';
      });
    }

    const btnPreviewReport = document.getElementById('btnPreviewReport');
    if (btnPreviewReport) {
      btnPreviewReport.addEventListener('click', () => this.previewReport());
    }

    const btnExportPDF = document.getElementById('btnExportPDF');
    if (btnExportPDF) {
      btnExportPDF.addEventListener('click', () => this.exportPDF());
    }

    const btnExportExcel = document.getElementById('btnExportExcel');
    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => this.exportExcel());
    }

    // Prórroga - Calcular días
    const prorrogaNuevaFecha = document.getElementById('prorrogaNuevaFecha');
    if (prorrogaNuevaFecha) {
      prorrogaNuevaFecha.addEventListener('change', () => this.calculateProrrogaDias());
    }
  }

  // Navegación
  // Manejo de clics en tarjetas del dashboard
  handleDashboardCardClick(action) {
    // Navegar a nombramientos
    this.switchView('nombramientos');
    
    // Resetear todos los filtros primero
    this.clearFilters();
    
    const filterAlert = document.getElementById('filterAlert');
    const filterAlertText = filterAlert?.querySelector('.filter-alert-text');
    
    // Aplicar filtro específico según la acción
    switch (action) {
      case 'view-nombramientos':
        // Mostrar todos, sin filtro adicional
        if (filterAlert) filterAlert.style.display = 'none';
        break;
        
      case 'view-horas-extras':
        // Filtrar nombramientos con horas extras
        this.currentFilter = 'horas-extras';
        if (filterAlert && filterAlertText) {
          filterAlertText.textContent = 'Mostrando solo nombramientos con horas extras';
          filterAlert.style.display = 'flex';
        }
        break;
        
      case 'view-proximos-vencer':
        // Filtrar próximos a vencer
        document.getElementById('filterEstado').value = 'proximo';
        if (filterAlert && filterAlertText) {
          filterAlertText.textContent = 'Mostrando nombramientos próximos a vencer (15 días o menos)';
          filterAlert.style.display = 'flex';
        }
        break;
    }
    
    // Recargar con el filtro aplicado
    this.filterNombramientos();
  }

  clearFilters() {
    document.getElementById('searchNombramientos').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterLugar').value = '';
    document.getElementById('filterEstado').value = '';
    this.currentFilter = null;
    
    const filterAlert = document.getElementById('filterAlert');
    if (filterAlert) filterAlert.style.display = 'none';
    
    this.filterNombramientos();
  }

  switchView(viewName) {
    // Actualizar vistas
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }

    this.currentView = viewName;

    // Cargar datos de la vista
    if (viewName === 'dashboard') {
      this.loadDashboard();
    } else if (viewName === 'nombramientos') {
      this.loadNombramientos();
    } else if (viewName === 'historial') {
      this.loadHistorial();
    } else if (viewName === 'reportes') {
      // La vista de reportes no necesita carga inicial
    }
  }

  // Dashboard
  async loadDashboard() {
    try {
      const periodo = document.getElementById('dashboardPeriod')?.value || 'all';
      const stats = await chartsManager.initDashboardCharts(periodo);
      
      // Actualizar stats cards
      document.getElementById('totalDias').textContent = stats.totalDias;
      document.getElementById('totalNombramientos').textContent = stats.totalNombramientos;
      document.getElementById('horasExtras').textContent = stats.horasExtras;
      document.getElementById('proximosVencer').textContent = stats.proximosVencer;
      
      // Cargar lista de próximos a vencer
      await this.loadProximosVencer();
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    }
  }

  async updateDashboard() {
    await this.loadDashboard();
  }

  async loadProximosVencer() {
    try {
      const nombramientos = await dbManager.getNombramientosProximosVencer();
      const container = document.getElementById('proximosVencerList');
      
      if (!nombramientos || nombramientos.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay nombramientos próximos a vencer</p></div>';
        return;
      }

      container.innerHTML = nombramientos.map(n => `
        <div class="nombramiento-card proximo" style="margin-bottom: 1rem;">
          <div class="nombramiento-header">
            <span class="nombramiento-tipo">${n.tipoNombramiento || 'N/A'}</span>
          </div>
          <div class="nombramiento-info">
            <div class="info-row">
              <span class="icon">📍</span>
              <strong>${n.lugar || 'N/A'}</strong>
            </div>
            <div class="info-row">
              <span class="icon">👤</span>
              ${n.puesto || 'N/A'}
            </div>
            <div class="info-row">
              <span class="icon">📅</span>
              Vence: ${new Date(n.fechaHasta).toLocaleDateString('es-CR')}
            </div>
          </div>
          <div class="nombramiento-footer">
            <span class="dias-badge">${n.diasTotales || 0} días</span>
            <button class="btn-secondary btn-sm" onclick="app.openProrrogaModal(${n.id})">
              Prorrogar
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error al cargar próximos a vencer:', error);
    }
  }

  // Nombramientos
  async loadNombramientos() {
    try {
      const nombramientos = await dbManager.getAllNombramientos();
      this.renderNombramientos(nombramientos);
      this.populateLugarFilter(nombramientos);
    } catch (error) {
      console.error('Error al cargar nombramientos:', error);
      notificationManager.error('Error al cargar los nombramientos');
    }
  }

  renderNombramientos(nombramientos) {
    const container = document.getElementById('nombramientosList');
    
    if (!nombramientos || nombramientos.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No hay nombramientos</div>
          <div class="empty-state-message">Comienza agregando tu primer nombramiento</div>
        </div>
      `;
      return;
    }

// Ordenar por fecha más reciente
    nombramientos.sort((a, b) => new Date(b.fechaDesde) - new Date(a.fechaDesde));

    container.innerHTML = nombramientos.map(n => {
      const estadoClass = n.estado || 'activo';
      const estadoText = {
        'activo': 'Activo',
        'vencido': 'Vencido',
        'proximo': 'Por Vencer'
      }[estadoClass] || 'Activo';

      return `
        <div class="nombramiento-card ${estadoClass}">
          <div class="nombramiento-header">
            <span class="nombramiento-tipo">${n.tipoNombramiento || 'N/A'}</span>
            <div class="nombramiento-actions">
              <button class="action-btn" onclick="app.openNombramientoModal(${n.id})" title="Editar">
                ✏️
              </button>
              <button class="action-btn" onclick="app.openProrrogaModal(${n.id})" title="Prorrogar">
                ⏰
              </button>
              <button class="action-btn" onclick="app.deleteNombramiento(${n.id})" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
          <div class="nombramiento-info">
            <div class="info-row">
              <span class="icon">📍</span>
              <strong>${n.lugar || 'N/A'}</strong>
            </div>
            <div class="info-row">
              <span class="icon">👤</span>
              ${n.puesto || 'N/A'}
            </div>
            <div class="info-row">
              <span class="icon">📅</span>
              ${new Date(n.fechaDesde).toLocaleDateString('es-CR')} - ${new Date(n.fechaHasta).toLocaleDateString('es-CR')}
            </div>
            ${n.horaEntrada && n.horaSalida ? `
              <div class="info-row">
                <span class="icon">🕐</span>
                Horario: ${this.formatTime(n.horaEntrada)} - ${this.formatTime(n.horaSalida)}
              </div>
            ` : ''}
            ${n.horasExtras && n.horasExtras.length > 0 ? `
              <div class="info-row horas-extras-highlight">
                <span class="icon">⏰</span>
                <strong>${n.horasExtras.reduce((sum, he) => sum + (he.horas || 0), 0)} horas extras</strong>
                <span class="horas-badge">${n.horasExtras.length} registro${n.horasExtras.length > 1 ? 's' : ''}</span>
              </div>
            ` : ''}
            ${n.prorrogas && n.prorrogas.length > 0 ? `
              <div class="info-row">
                <span class="icon">🔄</span>
                ${n.prorrogas.length} prórroga(s)
              </div>
            ` : ''}
          </div>
          ${n.notas ? `
            <div class="info-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
              <span class="icon">📝</span>
              <small style="color: var(--text-secondary);">${n.notas}</small>
            </div>
          ` : ''}
          <div class="nombramiento-footer">
            <span class="dias-badge">${n.diasTotales || 0} días</span>
            <span class="estado-badge ${estadoClass}">${estadoText}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  async filterNombramientos() {
    try {
      const nombramientos = await dbManager.getAllNombramientos();
      
      const search = document.getElementById('searchNombramientos').value.toLowerCase();
      const filterTipo = document.getElementById('filterTipo').value;
      const filterLugar = document.getElementById('filterLugar').value;
      const filterEstado = document.getElementById('filterEstado').value();

      let filtered = nombramientos.filter(n => {
        // Búsqueda
        if (search) {
          const searchText = `${n.lugar} ${n.puesto} ${n.tipoNombramiento}`.toLowerCase();
          if (!searchText.includes(search)) return false;
        }

        // Filtro tipo
        if (filterTipo && n.tipoNombramiento !== filterTipo) return false;

        // Filtro lugar
        if (filterLugar && n.lugar !== filterLugar) return false;

        // Filtro estado
        if (filterEstado && n.estado !== filterEstado) return false;

        // Filtro especial: horas extras (desde dashboard)
        if (this.currentFilter === 'horas-extras') {
          if (!n.horasExtras || n.horasExtras.length === 0) return false;
        }

        return true;
      });

      this.renderNombramientos(filtered);
      
      // Limpiar filtro especial después de aplicarlo
      this.currentFilter = null;
    } catch (error) {
      console.error('Error al filtrar nombramientos:', error);
    }
  }

  populateLugarFilter(nombramientos) {
    const filterLugar = document.getElementById('filterLugar');
    if (!filterLugar) return;

    // Obtener lugares únicos
    const lugares = [...new Set(nombramientos.map(n => n.lugar))].filter(Boolean).sort();

    // Limpiar opciones existentes (excepto la primera)
    while (filterLugar.options.length > 1) {
      filterLugar.remove(1);
    }

    // Agregar opciones
    lugares.forEach(lugar => {
      const option = document.createElement('option');
      option.value = lugar;
      option.textContent = lugar;
      filterLugar.appendChild(option);
    });
  }

  // Modal Nombramiento
  openNombramientoModal(id = null) {
    const modal = document.getElementById('nombramientoModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('nombramientoForm');
    
    // Reset form
    form.reset();
    document.getElementById('horasExtrasList').innerHTML = '';
    document.getElementById('horasExtrasContainer').style.display = 'none';
    document.getElementById('tieneHorasExtras').checked = false;
    document.getElementById('otroTipoContainer').style.display = 'none';
    document.getElementById('puesto').value = '';
    document.getElementById('lugar').disabled = true;
    this.horasExtrasCounter = 0;
    document.getElementById('horarioPreset').value = '';
    document.getElementById('horarioCustomFields').style.display = 'none';
    document.getElementById('horaEntrada').value = '';
    document.getElementById('horaSalida').value = '';
    document.getElementById('horaEntrada').required = false;
    document.getElementById('horaSalida').required = false;
    document.getElementById('horarioPreview').innerHTML = '';
    this.updateHorasExtrasTotal();

    if (id) {
      // Editar
      title.textContent = 'Editar Nombramiento';
      this.loadNombramientoData(id);
      this.currentNombramiento = id;
    } else {
      // Nuevo
      title.textContent = 'Nuevo Nombramiento';
      this.currentNombramiento = null;
    }

    modal.classList.add('active');
  }

  async loadNombramientoData(id) {
    try {
      const nombramiento = await dbManager.getNombramiento(id);
      if (!nombramiento) {
        notificationManager.error('Nombramiento no encontrado');
        return;
      }

// Llenar formulario
      document.getElementById('tipoLugar').value = nombramiento.tipoLugar || '';
      await this.loadLugares(nombramiento.tipoLugar);
      document.getElementById('lugar').value = nombramiento.lugar || '';
      document.getElementById('fechaDesde').value = nombramiento.fechaDesde || '';
      document.getElementById('fechaHasta').value = nombramiento.fechaHasta || '';
      document.getElementById('puestoSearch').value = nombramiento.puesto || '';
      document.getElementById('puesto').value = nombramiento.puesto || '';
      document.getElementById('tipoNombramiento').value = nombramiento.tipoNombramiento || '';
      
      if (nombramiento.tipoNombramiento === 'otro') {
        document.getElementById('otroTipoContainer').style.display = 'block';
        document.getElementById('otroTipo').value = nombramiento.otroTipo || '';
      }
      
      document.getElementById('notas').value = nombramiento.notas || '';
      
      // Cargar horario
      document.getElementById('horarioPreset').value = nombramiento.horarioPreset || '';
      if (nombramiento.horarioPreset === 'otro' && nombramiento.horaEntrada && nombramiento.horaSalida) {
        document.getElementById('horarioCustomFields').style.display = 'block';
        document.getElementById('horaEntrada').value = nombramiento.horaEntrada;
        document.getElementById('horaSalida').value = nombramiento.horaSalida;
        document.getElementById('horaEntrada').required = true;
        document.getElementById('horaSalida').required = true;
        this.updateHorarioPreview(nombramiento.horaEntrada, nombramiento.horaSalida);
      } else if (nombramiento.horarioPreset && this.horarios[nombramiento.horarioPreset]) {
        const horario = this.horarios[nombramiento.horarioPreset];
        document.getElementById('horaEntrada').value = horario.entrada;
        document.getElementById('horaSalida').value = horario.salida;
        this.updateHorarioPreview(horario.entrada, horario.salida);
      }
      
      this.calculateDias();
      
      // Horas extras
      if (nombramiento.horasExtras && nombramiento.horasExtras.length > 0) {
        document.getElementById('tieneHorasExtras').checked = true;
        document.getElementById('horasExtrasContainer').style.display = 'block';
        
        nombramiento.horasExtras.forEach(he => {
          this.addHoraExtraField(he);
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del nombramiento:', error);
      notificationManager.error('Error al cargar los datos');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  async loadLugares(tipo) {
    const lugarSelect = document.getElementById('lugar');
    if (!lugarSelect) return;

    lugarSelect.innerHTML = '<option value="">Seleccione...</option>';
    lugarSelect.disabled = !tipo;

    if (!tipo) return;

    console.log('Loading lugares for tipo:', tipo);
    console.log('CENTROS_CCSS available:', typeof CENTROS_CCSS !== 'undefined');
    
    const centros = getCentrosPorTipo(tipo);
    console.log('Centros found:', centros.length);
    
    centros.forEach(centro => {
      const option = document.createElement('option');
      option.value = centro;
      option.textContent = centro;
      lugarSelect.appendChild(option);
    });
    
    console.log('Options added to select:', lugarSelect.options.length);
  }

  calculateDias() {
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;

    if (fechaDesde && fechaHasta) {
      const dias = dbManager.calcularDias(fechaDesde, fechaHasta);
      document.getElementById('diasTotales').value = `${dias} días`;
    } else {
      document.getElementById('diasTotales').value = '';
    }
  }

  // Horas Extras
  addHoraExtraField(data = null) {
    const container = document.getElementById('horasExtrasList');
    const id = this.horasExtrasCounter++;

    const div = document.createElement('div');
    div.className = 'hora-extra-item';
    div.dataset.id = id;

    div.innerHTML = `
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" name="horaExtra_fecha_${id}" value="${data?.fecha || ''}" required class="hora-extra-input">
      </div>
      <div class="form-group">
        <label>Horas</label>
        <input type="number" name="horaExtra_horas_${id}" min="0.5" step="0.5" value="${data?.horas || ''}" required class="hora-extra-input">
      </div>
      <button type="button" class="hora-extra-remove" title="Eliminar registro">
        🗑️
      </button>
    `;

    // Agregar event listener para el botón de eliminar
    const removeBtn = div.querySelector('.hora-extra-remove');
    removeBtn.addEventListener('click', () => {
      div.remove();
      this.updateHorasExtrasTotal();
    });

    // Agregar event listeners para los inputs para actualizar el total
    const inputs = div.querySelectorAll('.hora-extra-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.updateHorasExtrasTotal());
      input.addEventListener('change', () => this.updateHorasExtrasTotal());
    });

    container.appendChild(div);
    this.updateHorasExtrasTotal();
  }

  updateHorasExtrasTotal() {
    const items = document.querySelectorAll('.hora-extra-item');
    const totalDisplay = document.getElementById('horasExtrasTotal');
    const totalValue = document.getElementById('totalHorasValue');
    
    if (items.length === 0) {
      if (totalDisplay) totalDisplay.style.display = 'none';
      return;
    }

    let total = 0;
    items.forEach(item => {
      const horasInput = item.querySelector('input[type="number"]');
      if (horasInput && horasInput.value) {
        total += parseFloat(horasInput.value) || 0;
      }
    });

    if (totalDisplay && totalValue) {
      totalValue.textContent = total.toFixed(1);
      totalDisplay.style.display = 'block';
    }
  }

  collectHorasExtras() {
    const items = document.querySelectorAll('.hora-extra-item');
    const horasExtras = [];

    items.forEach(item => {
      const id = item.dataset.id;
      const fecha = item.querySelector(`[name="horaExtra_fecha_${id}"]`).value;
      const horas = parseFloat(item.querySelector(`[name="horaExtra_horas_${id}"]`).value);

      if (fecha && horas) {
        horasExtras.push({ fecha, horas });
      }
    });

    return horasExtras;
  }

  // Búsqueda de puestos
  searchPuestos(query) {
    const suggestionsContainer = document.getElementById('puestoSuggestions');
    
    if (!query || query.length < 2) {
      suggestionsContainer.classList.remove('active');
      suggestionsContainer.innerHTML = '';
      return;
    }

    const results = buscarPuestos(query, 10);

    if (results.length === 0) {
      suggestionsContainer.innerHTML = '<div class="suggestion-item no-hover">No se encontraron resultados</div>';
      suggestionsContainer.classList.add('active');
      return;
    }

    suggestionsContainer.innerHTML = results.map(puesto => `
      <div class="suggestion-item" data-puesto="${puesto.replace(/"/g, '&quot;')}">
        ${puesto.replace(new RegExp(query, 'gi'), match => `<strong>${match}</strong>`)}
      </div>
    `).join('');

    // Agregar event listeners a cada sugerencia
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
      if (!item.classList.contains('no-hover')) {
        item.addEventListener('click', () => {
          const puesto = item.getAttribute('data-puesto');
          this.selectPuesto(puesto);
        });
      }
    });

    suggestionsContainer.classList.add('active');
  }

  selectPuesto(puesto) {
    document.getElementById('puestoSearch').value = puesto;
    document.getElementById('puesto').value = puesto;
    document.getElementById('puestoSuggestions').classList.remove('active');
  }

  // Submit Nombramiento
  async handleNombramientoSubmit(e) {
    e.preventDefault();

    try {
      this.showLoading(true);

      const formData = {
        tipoLugar: document.getElementById('tipoLugar').value,
        lugar: document.getElementById('lugar').value,
        fechaDesde: document.getElementById('fechaDesde').value,
        fechaHasta: document.getElementById('fechaHasta').value,
        diasTotales: dbManager.calcularDias(
          document.getElementById('fechaDesde').value,
          document.getElementById('fechaHasta').value
        ),
        puesto: document.getElementById('puesto').value,
        tipoNombramiento: document.getElementById('tipoNombramiento').value,
        notas: document.getElementById('notas').value,
        horarioPreset: document.getElementById('horarioPreset').value,
        horaEntrada: document.getElementById('horaEntrada').value,
        horaSalida: document.getElementById('horaSalida').value
      };

      if (formData.tipoNombramiento === 'otro') {
        formData.otroTipo = document.getElementById('otroTipo').value;
      }

      // Horas extras
      if (document.getElementById('tieneHorasExtras').checked) {
        formData.horasExtras = this.collectHorasExtras();
      }

      if (this.currentNombramiento) {
        // Editar
        await dbManager.updateNombramiento(this.currentNombramiento, formData);
        notificationManager.success('Nombramiento actualizado exitosamente');
      } else {
        // Crear
        await dbManager.addNombramiento(formData);
        notificationManager.success('Nombramiento creado exitosamente');
      }

      this.closeModal('nombramientoModal');
      await this.loadNombramientos();
      
      // Si estamos en dashboard, actualizar también
      if (this.currentView === 'dashboard') {
        await this.loadDashboard();
      }

      this.showLoading(false);
    } catch (error) {
      console.error('Error al guardar nombramiento:', error);
      notificationManager.error('Error al guardar el nombramiento');
      this.showLoading(false);
    }
  }

  // Eliminar Nombramiento
  async deleteNombramiento(id) {
    const confirmed = await notificationManager.confirm(
      '¿Estás seguro de que deseas eliminar este nombramiento?',
      'Confirmar Eliminación'
    );

    if (!confirmed) return;

    try {
      this.showLoading(true);
      await dbManager.deleteNombramiento(id);
      notificationManager.success('Nombramiento eliminado exitosamente');
      await this.loadNombramientos();
      
      if (this.currentView === 'dashboard') {
        await this.loadDashboard();
      }

      this.showLoading(false);
    } catch (error) {
      console.error('Error al eliminar nombramiento:', error);
      notificationManager.error('Error al eliminar el nombramiento');
      this.showLoading(false);
    }
  }

  // Prórroga
  async openProrrogaModal(id) {
    try {
      const nombramiento = await dbManager.getNombramiento(id);
      if (!nombramiento) {
        notificationManager.error('Nombramiento no encontrado');
        return;
      }

      document.getElementById('prorrogaNombramientoId').value = id;
      document.getElementById('prorrogaFechaActual').value = 
        new Date(nombramiento.fechaHasta).toLocaleDateString('es-CR');
      document.getElementById('prorrogaNuevaFecha').value = '';
      document.getElementById('prorrogaDiasAdicionales').value = '';
      document.getElementById('prorrogaTotalDias').value = '';
      document.getElementById('prorrogaNotas').value = '';

      document.getElementById('prorrogaModal').classList.add('active');
    } catch (error) {
      console.error('Error al abrir modal de prórroga:', error);
      notificationManager.error('Error al cargar los datos');
    }
  }

  calculateProrrogaDias() {
    const id = document.getElementById('prorrogaNombramientoId').value;
    const nuevaFecha = document.getElementById('prorrogaNuevaFecha').value;

    if (!id || !nuevaFecha) return;

    dbManager.getNombramiento(parseInt(id)).then(nombramiento => {
      if (!nombramiento) return;

      const diasAdicionales = dbManager.calcularDias(nombramiento.fechaHasta, nuevaFecha) - 1;
      const totalDias = nombramiento.diasTotales + diasAdicionales;

      document.getElementById('prorrogaDiasAdicionales').value = `${diasAdicionales} días`;
      document.getElementById('prorrogaTotalDias').value = `${totalDias} días`;
    });
  }

  async handleProrrogaSubmit(e) {
    e.preventDefault();

    try {
      this.showLoading(true);

      const id = parseInt(document.getElementById('prorrogaNombramientoId').value);
      const nuevaFecha = document.getElementById('prorrogaNuevaFecha').value;
      const notas = document.getElementById('prorrogaNotas').value;

      await dbManager.prorrogarNombramiento(id, nuevaFecha, notas);
      
      notificationManager.success('Prórroga aplicada exitosamente');
      this.closeModal('prorrogaModal');
      
      await this.loadNombramientos();
      if (this.currentView === 'dashboard') {
        await this.loadDashboard();
      }

      this.showLoading(false);
    } catch (error) {
      console.error('Error al aplicar prórroga:', error);
      notificationManager.error('Error al aplicar la prórroga');
      this.showLoading(false);
    }
  }

  // Historial
  async loadHistorial() {
    try {
      const historial = await dbManager.getAllHistorial();
      this.renderHistorial(historial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      notificationManager.error('Error al cargar el historial');
    }
  }

  renderHistorial(historial) {
    const container = document.getElementById('historialList');

    if (!historial || historial.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🕐</div>
          <div class="empty-state-title">No hay historial</div>
          <div class="empty-state-message">Los cambios se registrarán aquí</div>
        </div>
      `;
      return;
    }

    container.innerHTML = historial.map(h => `
      <div class="historial-item ${h.accion}">
        <div class="historial-header">
          <span class="historial-accion ${h.accion}">${this.getAccionLabel(h.accion)}</span>
          <span class="historial-fecha">${this.formatFecha(h.timestamp)}</span>
        </div>
        <div class="historial-detalles">${h.detalles || 'Sin detalles'}</div>
      </div>
    `).join('');
  }

  async filterHistorial() {
    try {
      const historial = await dbManager.getAllHistorial();
      
      const search = document.getElementById('searchHistorial').value.toLowerCase();
      const filterAccion = document.getElementById('filterAccion').value;

      let filtered = historial.filter(h => {
        if (search && !h.detalles.toLowerCase().includes(search)) return false;
        if (filterAccion && h.accion !== filterAccion) return false;
        return true;
      });

      this.renderHistorial(filtered);
    } catch (error) {
      console.error('Error al filtrar historial:', error);
    }
  }

  getAccionLabel(accion) {
    const labels = {
      'crear': '✅ Crear',
      'editar': '✏️ Editar',
      'eliminar': '🗑️ Eliminar',
      'prorrogar': '⏰ Prorrogar'
    };
    return labels[accion] || accion;
  }

  // Reportes
  async previewReport() {
    const tipo = document.getElementById('reportType').value;
    const periodo = document.getElementById('reportPeriod').value;
    const fechaDesde = document.getElementById('reportDateFrom')?.value;
    const fechaHasta = document.getElementById('reportDateTo')?.value;

    await reportsManager.generatePreview(tipo, periodo, fechaDesde, fechaHasta);
  }

  async exportPDF() {
    const tipo = document.getElementById('reportType').value;
    const periodo = document.getElementById('reportPeriod').value;
    const fechaDesde = document.getElementById('reportDateFrom')?.value;
    const fechaHasta = document.getElementById('reportDateTo')?.value;

    this.showLoading(true);
    await reportsManager.generatePDF(tipo, periodo, fechaDesde, fechaHasta);
    this.showLoading(false);
  }

  async exportExcel() {
    const tipo = document.getElementById('reportType').value;
    const periodo = document.getElementById('reportPeriod').value;
    const fechaDesde = document.getElementById('reportDateFrom')?.value;
    const fechaHasta = document.getElementById('reportDateTo')?.value;

    this.showLoading(true);
    await reportsManager.generateExcel(tipo, periodo, fechaDesde, fechaHasta);
    this.showLoading(false);
  }

  // Tema
  async loadTheme() {
    const savedTheme = await dbManager.getConfig('theme');
    this.theme = savedTheme || 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  async toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    await dbManager.setConfig('theme', this.theme);
  }

  // Perfil de Usuario
  async openProfileModal() {
    const profile = await dbManager.getConfig('userProfile') || {};
    
    document.getElementById('userName').value = profile.name || '';
    document.getElementById('userCedula').value = profile.cedula || '';
    document.getElementById('userEmail').value = profile.email || '';
    document.getElementById('notificationsEnabled').checked = profile.notificationsEnabled !== false;
    document.getElementById('notificationDays').value = profile.notificationDays || '15';
    
    this.openModal('profileModal');
  }

  async handleProfileSubmit(e) {
    e.preventDefault();
    
    try {
      const profile = {
        name: document.getElementById('userName').value.trim(),
        cedula: document.getElementById('userCedula').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        notificationsEnabled: document.getElementById('notificationsEnabled').checked,
        notificationDays: parseInt(document.getElementById('notificationDays').value)
      };
      
      await dbManager.setConfig('userProfile', profile);
      
      // Actualizar saludo
      this.updateUserGreeting();
      
      this.closeModal('profileModal');
      notificationManager.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      notificationManager.error('Error al guardar el perfil');
    }
  }

  async updateUserGreeting() {
    const profile = await dbManager.getConfig('userProfile');
    const greetingEl = document.getElementById('userGreeting');
    
    if (profile && profile.name && greetingEl) {
      const hour = new Date().getHours();
      let greeting = '¡Buenas!';
      
      if (hour < 12) greeting = '¡Buenos días!';
      else if (hour < 19) greeting = '¡Buenas tardes!';
      else greeting = '¡Buenas noches!';
      
      greetingEl.textContent = `${greeting} ${profile.name}`;
      greetingEl.style.display = 'block';
    } else if (greetingEl) {
      greetingEl.style.display = 'none';
    }
  }

  // Utilidades
  showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
  }

  formatFecha(timestamp) {
    const fecha = new Date(timestamp);
    const ahora = new Date();
    const diff = ahora - fecha;
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    
    return fecha.toLocaleDateString('es-CR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Instancia global de la app
const app = new App();

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();

// Métodos para gestión de horarios
updateHorarioPreview(entrada, salida) {
  const preview = document.getElementById('horarioPreview');
  if (!preview) return;
  
  const horas = this.calcularHorasJornada(entrada, salida);
  const entradaFormateada = this.formatTime(entrada);
  const salidaFormateada = this.formatTime(salida);
  
  preview.innerHTML = `
    <div class="horario-info-preview">
      <div class="horario-item">
        <span class="icon">🕐</span>
        <strong>Entrada:</strong> ${entradaFormateada}
      </div>
      <div class="horario-item">
        <span class="icon">🕐</span>
        <strong>Salida:</strong> ${salidaFormateada}
      </div>
      <div class="horario-item">
        <span class="icon">⏱️</span>
        <strong>Jornada:</strong> ${horas} horas
      </div>
    </div>
  `;
}

calcularHorasJornada(entrada, salida) {
  const [horaE, minE] = entrada.split(':').map(Number);
  const [horaS, minS] = salida.split(':').map(Number);
  
  let minutosE = horaE * 60 + minE;
  let minutosS = horaS * 60 + minS;
  
  // Si salida es menor que entrada, es el día siguiente
  if (minutosS < minutosE) {
    minutosS += 24 * 60;
  }
  
  const totalMinutos = minutosS - minutosE;
  return (totalMinutos / 60).toFixed(1);
}

formatTime(time) {
  const [hora, minuto] = time.split(':');
  const h = parseInt(hora);
  const periodo = h >= 12 ? 'PM' : 'AM';
  const hora12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return `${hora12}:${minuto} ${periodo}`;
}
  
}
