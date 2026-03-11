// Reports Manager - Generación de reportes PDF y Excel
class ReportsManager {
  constructor() {
    this.currentPreview = null;
  }

  // Generar reporte en PDF
  async generatePDF(tipo, periodo, fechaDesde = null, fechaHasta = null) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const stats = await dbManager.getEstadisticas(periodo, fechaDesde, fechaHasta);
      
      // Configurar fuente
      doc.setFont('helvetica');
      
      // Encabezado
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204); // Azul CCSS
      doc.text('Mis Nombramientos - CCSS', 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      const tipoReporte = this.getTipoReporteNombre(tipo);
      doc.text(tipoReporte, 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-CR')}`, 105, 37, { align: 'center' });
      
      // Línea separadora
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(20, 42, 190, 42);
      
      let yPos = 50;
      
      if (tipo === 'general') {
        yPos = this.addGeneralReport(doc, stats, yPos);
      } else if (tipo === 'detallado') {
        yPos = this.addDetailedReport(doc, stats, yPos);
      } else if (tipo === 'horas') {
        yPos = this.addHorasReport(doc, stats, yPos);
      } else if (tipo === 'lugares') {
        yPos = this.addLugaresReport(doc, stats, yPos);
      }
      
      // Pie de página en cada página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      // Guardar
      const filename = `Reporte_${tipo}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      notificationManager.success('Reporte PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      notificationManager.error('Error al generar el reporte PDF');
    }
  }

  // Generar reporte en Excel
  async generateExcel(tipo, periodo, fechaDesde = null, fechaHasta = null) {
    try {
      const stats = await dbManager.getEstadisticas(periodo, fechaDesde, fechaHasta);
      
      const wb = XLSX.utils.book_new();
      
      if (tipo === 'general') {
        this.addGeneralExcelSheet(wb, stats);
      } else if (tipo === 'detallado') {
        this.addDetailedExcelSheet(wb, stats);
      } else if (tipo === 'horas') {
        this.addHorasExcelSheet(wb, stats);
      } else if (tipo === 'lugares') {
        this.addLugaresExcelSheet(wb, stats);
      }
      
      const filename = `Reporte_${tipo}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      notificationManager.success('Reporte Excel generado exitosamente');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      notificationManager.error('Error al generar el reporte Excel');
    }
  }

  // Generar vista previa HTML
  async generatePreview(tipo, periodo, fechaDesde = null, fechaHasta = null) {
    try {
      const stats = await dbManager.getEstadisticas(periodo, fechaDesde, fechaHasta);
      
      let html = `
        <div class="report-header">
          <h2>Reporte ${this.getTipoReporteNombre(tipo)}</h2>
          <p>Generado: ${new Date().toLocaleDateString('es-CR', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}</p>
        </div>
      `;
      
      if (tipo === 'general') {
        html += this.getGeneralPreview(stats);
      } else if (tipo === 'detallado') {
        html += this.getDetailedPreview(stats);
      } else if (tipo === 'horas') {
        html += this.getHorasPreview(stats);
      } else if (tipo === 'lugares') {
        html += this.getLugaresPreview(stats);
      }
      
      const previewContainer = document.getElementById('reportPreview');
      if (previewContainer) {
        previewContainer.innerHTML = html;
        this.currentPreview = { tipo, periodo, fechaDesde, fechaHasta };
      }
    } catch (error) {
      console.error('Error al generar vista previa:', error);
      notificationManager.error('Error al generar la vista previa');
    }
  }

  // Reporte General para PDF
  addGeneralReport(doc, stats, yPos) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumen General', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    const resumen = [
      ['Total de Nombramientos', stats.totalNombramientos],
      ['Total de Días', stats.totalDias],
      ['Horas Extraordinarias', stats.horasExtras],
      ['Próximos a Vencer', stats.proximosVencer]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Métrica', 'Valor']],
      body: resumen,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Distribución por tipo
    if (Object.keys(stats.porTipo).length > 0) {
      doc.setFontSize(12);
      doc.text('Distribución por Tipo', 20, yPos);
      yPos += 10;
      
      const porTipoData = Object.entries(stats.porTipo).map(([tipo, count]) => [tipo, count]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Tipo de Nombramiento', 'Cantidad']],
        body: porTipoData,
        theme: 'striped',
        headStyles: { fillColor: [0, 166, 81] }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    return yPos;
  }

  // Reporte Detallado para PDF
  addDetailedReport(doc, stats, yPos) {
    const nombramientos = stats.nombramientos;
    
    if (nombramientos.length === 0) {
      doc.setFontSize(10);
      doc.text('No hay nombramientos en el período seleccionado', 20, yPos);
      return yPos + 10;
    }
    
    const tableData = nombramientos.map(n => [
      n.lugar || 'N/A',
      n.puesto || 'N/A',
      new Date(n.fechaDesde).toLocaleDateString('es-CR'),
      new Date(n.fechaHasta).toLocaleDateString('es-CR'),
      n.diasTotales || 0,
      n.tipoNombramiento || 'N/A'
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Lugar', 'Puesto', 'Desde', 'Hasta', 'Días', 'Tipo']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 }
      }
    });
    
    return doc.lastAutoTable.finalY + 10;
  }

  // Reporte de Horas para PDF
  addHorasReport(doc, stats, yPos) {
    doc.setFontSize(12);
    doc.text(`Total Horas Extraordinarias: ${stats.horasExtras}`, 20, yPos);
    yPos += 15;
    
    const nombramientosConHoras = stats.nombramientos.filter(n => 
      n.horasExtras && n.horasExtras.length > 0
    );
    
    if (nombramientosConHoras.length === 0) {
      doc.setFontSize(10);
      doc.text('No hay registros de horas extraordinarias', 20, yPos);
      return yPos + 10;
    }
    
    const tableData = [];
    nombramientosConHoras.forEach(n => {
      n.horasExtras.forEach(he => {
        tableData.push([
          n.lugar || 'N/A',
          new Date(he.fecha).toLocaleDateString('es-CR'),
          he.horas,
          he.descripcion || 'Sin descripción'
        ]);
      });
    });
    
    doc.autoTable({
      startY: yPos,
      head: [['Lugar', 'Fecha', 'Horas', 'Descripción']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 166, 81] },
      styles: { fontSize: 9 }
    });
    
    return doc.lastAutoTable.finalY + 10;
  }

  // Reporte de Lugares para PDF
  addLugaresReport(doc, stats, yPos) {
    const porLugarData = Object.entries(stats.porLugar)
      .sort((a, b) => b[1] - a[1])
      .map(([lugar, count]) => [lugar, count]);
    
    if (porLugarData.length === 0) {
      doc.setFontSize(10);
      doc.text('No hay datos de lugares', 20, yPos);
      return yPos + 10;
    }
    
    doc.autoTable({
      startY: yPos,
      head: [['Lugar de Trabajo', 'Nombramientos']],
      body: porLugarData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      styles: { fontSize: 9 }
    });
    
    return doc.lastAutoTable.finalY + 10;
  }

  // Excel Sheets
  addGeneralExcelSheet(wb, stats) {
    const wsData = [
      ['Reporte General - Mis Nombramientos CCSS'],
      ['Generado:', new Date().toLocaleDateString('es-CR')],
      [],
      ['Resumen General'],
      ['Métrica', 'Valor'],
      ['Total Nombramientos', stats.totalNombramientos],
      ['Total Días', stats.totalDias],
      ['Horas Extraordinarias', stats.horasExtras],
      ['Próximos a Vencer', stats.proximosVencer],
      [],
      ['Distribución por Tipo'],
      ['Tipo', 'Cantidad'],
      ...Object.entries(stats.porTipo).map(([tipo, count]) => [tipo, count])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen');
  }

  addDetailedExcelSheet(wb, stats) {
    const wsData = [
      ['Reporte Detallado - Mis Nombramientos CCSS'],
      ['Generado:', new Date().toLocaleDateString('es-CR')],
      [],
      ['Lugar', 'Puesto', 'Desde', 'Hasta', 'Días', 'Tipo', 'Estado'],
      ...stats.nombramientos.map(n => [
        n.lugar || 'N/A',
        n.puesto || 'N/A',
        new Date(n.fechaDesde).toLocaleDateString('es-CR'),
        new Date(n.fechaHasta).toLocaleDateString('es-CR'),
        n.diasTotales || 0,
        n.tipoNombramiento || 'N/A',
        n.estado || 'N/A'
      ])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Detallado');
  }

  addHorasExcelSheet(wb, stats) {
    const nombramientosConHoras = stats.nombramientos.filter(n => 
      n.horasExtras && n.horasExtras.length > 0
    );
    
    const wsData = [
      ['Reporte Horas Extraordinarias - CCSS'],
      ['Total Horas:', stats.horasExtras],
      [],
      ['Lugar', 'Fecha', 'Horas', 'Descripción']
    ];
    
    nombramientosConHoras.forEach(n => {
      n.horasExtras.forEach(he => {
        wsData.push([
          n.lugar || 'N/A',
          new Date(he.fecha).toLocaleDateString('es-CR'),
          he.horas,
          he.descripcion || 'Sin descripción'
        ]);
      });
    });
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Horas Extras');
  }

  addLugaresExcelSheet(wb, stats) {
    const wsData = [
      ['Reporte por Lugares - CCSS'],
      ['Generado:', new Date().toLocaleDateString('es-CR')],
      [],
      ['Lugar de Trabajo', 'Nombramientos'],
      ...Object.entries(stats.porLugar)
        .sort((a, b) => b[1] - a[1])
        .map(([lugar, count]) => [lugar, count])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Por Lugares');
  }

  // Vistas previas HTML
  getGeneralPreview(stats) {
    return `
      <div class="preview-section">
        <h3>Resumen General</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Nombramientos</div>
            <div class="stat-value">${stats.totalNombramientos}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Días</div>
            <div class="stat-value">${stats.totalDias}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Horas Extraordinarias</div>
            <div class="stat-value">${stats.horasExtras}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Próximos a Vencer</div>
            <div class="stat-value">${stats.proximosVencer}</div>
          </div>
        </div>
        
        <h4>Distribución por Tipo</h4>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Tipo de Nombramiento</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(stats.porTipo).map(([tipo, count]) => `
              <tr>
                <td>${tipo}</td>
                <td>${count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  getDetailedPreview(stats) {
    return `
      <div class="preview-section">
        <h3>Listado Detallado (${stats.nombramientos.length} nombramientos)</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Lugar</th>
              <th>Puesto</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Días</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${stats.nombramientos.map(n => `
              <tr>
                <td>${n.lugar || 'N/A'}</td>
                <td>${n.puesto || 'N/A'}</td>
                <td>${new Date(n.fechaDesde).toLocaleDateString('es-CR')}</td>
                <td>${new Date(n.fechaHasta).toLocaleDateString('es-CR')}</td>
                <td>${n.diasTotales || 0}</td>
                <td>${n.tipoNombramiento || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  getHorasPreview(stats) {
    const nombramientosConHoras = stats.nombramientos.filter(n => 
      n.horasExtras && n.horasExtras.length > 0
    );
    
    let rows = '';
    nombramientosConHoras.forEach(n => {
      n.horasExtras.forEach(he => {
        rows += `
          <tr>
            <td>${n.lugar || 'N/A'}</td>
            <td>${new Date(he.fecha).toLocaleDateString('es-CR')}</td>
            <td>${he.horas}</td>
            <td>${he.descripcion || 'Sin descripción'}</td>
          </tr>
        `;
      });
    });
    
    return `
      <div class="preview-section">
        <h3>Horas Extraordinarias (Total: ${stats.horasExtras} horas)</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Lugar</th>
              <th>Fecha</th>
              <th>Horas</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="4">No hay registros</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  getLugaresPreview(stats) {
    return `
      <div class="preview-section">
        <h3>Nombramientos por Lugar</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Lugar de Trabajo</th>
              <th>Nombramientos</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(stats.porLugar)
              .sort((a, b) => b[1] - a[1])
              .map(([lugar, count]) => `
                <tr>
                  <td>${lugar}</td>
                  <td>${count}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  getTipoReporteNombre(tipo) {
    const nombres = {
      general: 'Resumen General',
      detallado: 'Reporte Detallado',
      horas: 'Horas Extraordinarias',
      lugares: 'Por Lugares de Trabajo'
    };
    return nombres[tipo] || 'Reporte';
  }
}

// Instancia global
const reportsManager = new ReportsManager();
