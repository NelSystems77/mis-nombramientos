// Charts Manager - Gestión de gráficos con Chart.js
class ChartsManager {
  constructor() {
    this.charts = {};
    this.defaultColors = [
      '#0066cc', '#00a651', '#ff6b35', '#ffc107', 
      '#17a2b8', '#dc3545', '#6f42c1', '#20c997',
      '#fd7e14', '#e83e8c'
    ];
  }

  // Inicializar todos los gráficos del dashboard
  async initDashboardCharts(periodo = 'all', fechaDesde = null, fechaHasta = null) {
    try {
      const stats = await dbManager.getEstadisticas(periodo, fechaDesde, fechaHasta);
      
      this.renderChartMeses(stats.porMes);
      this.renderChartTipos(stats.porTipo);
      this.renderChartHorasExtras(stats.horasExtrasPorMes);
      this.renderChartLugares(stats.porLugar);
      
      return stats;
    } catch (error) {
      console.error('Error al inicializar gráficos:', error);
      notificationManager.error('Error al cargar las estadísticas');
    }
  }

  // Gráfico de nombramientos por mes
  renderChartMeses(data) {
    const ctx = document.getElementById('chartMeses');
    if (!ctx) return;

    // Destruir gráfico existente
    if (this.charts.meses) {
      this.charts.meses.destroy();
    }

    // Ordenar por fecha
    const sortedEntries = Object.entries(data).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });

    const labels = sortedEntries.map(([mes]) => mes);
    const valores = sortedEntries.map(([, count]) => count);

    this.charts.meses = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombramientos',
          data: valores,
          borderColor: this.defaultColors[0],
          backgroundColor: this.hexToRgba(this.defaultColors[0], 0.1),
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: this.defaultColors[0],
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                return ` ${context.parsed.y} nombramiento${context.parsed.y !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Gráfico de tipos de nombramiento
  renderChartTipos(data) {
    const ctx = document.getElementById('chartTipos');
    if (!ctx) return;

    if (this.charts.tipos) {
      this.charts.tipos.destroy();
    }

    const labels = Object.keys(data);
    const valores = Object.values(data);

    this.charts.tipos = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valores,
          backgroundColor: this.defaultColors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              },
              generateLabels: (chart) => {
                const data = chart.data;
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  return {
                    text: `${label}: ${value}`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return ` ${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Gráfico de horas extras mensuales
  renderChartHorasExtras(data) {
    const ctx = document.getElementById('chartHorasExtras');
    if (!ctx) return;

    if (this.charts.horasExtras) {
      this.charts.horasExtras.destroy();
    }

    // Ordenar por fecha
    const sortedEntries = Object.entries(data).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });

    const labels = sortedEntries.map(([mes]) => mes);
    const valores = sortedEntries.map(([, horas]) => horas);

    this.charts.horasExtras = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Horas',
          data: valores,
          backgroundColor: this.hexToRgba(this.defaultColors[1], 0.7),
          borderColor: this.defaultColors[1],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                return ` ${context.parsed.y} hora${context.parsed.y !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Gráfico de top 5 lugares
  renderChartLugares(data) {
    const ctx = document.getElementById('chartLugares');
    if (!ctx) return;

    if (this.charts.lugares) {
      this.charts.lugares.destroy();
    }

    // Obtener top 5
    const sortedEntries = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const labels = sortedEntries.map(([lugar]) => {
      // Truncar nombres largos
      return lugar.length > 30 ? lugar.substring(0, 27) + '...' : lugar;
    });
    const valores = sortedEntries.map(([, count]) => count);

    this.charts.lugares = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombramientos',
          data: valores,
          backgroundColor: this.defaultColors.slice(0, 5).map(color => this.hexToRgba(color, 0.7)),
          borderColor: this.defaultColors.slice(0, 5),
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y', // Barras horizontales
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              title: (items) => {
                // Mostrar nombre completo en tooltip
                const index = items[0].dataIndex;
                return sortedEntries[index][0];
              },
              label: (context) => {
                return ` ${context.parsed.x} nombramiento${context.parsed.x !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Destruir todos los gráficos
  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }

  // Utilidad: convertir hex a rgba
  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Actualizar gráficos cuando cambia el período
  async updateCharts(periodo, fechaDesde = null, fechaHasta = null) {
    await this.initDashboardCharts(periodo, fechaDesde, fechaHasta);
  }
}

// Instancia global
const chartsManager = new ChartsManager();
