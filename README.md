# 🐵 Mis Nombramientos - PWA CCSS

Progressive Web App profesional para gestión de nombramientos y tiempo extraordinario de la CCSS.

## 📋 Características Principales

### ✅ Funcionalidades Core
- **Gestión de Nombramientos**: Registro completo con fechas, lugares y puestos
- **Tiempo Extraordinario**: Control detallado de horas extras por fecha
- **Prórrogas**: Extensión de nombramientos con recalculo automático
- **Dashboard Interactivo**: Visualización completa de toda tu información
- **Reportes Profesionales**: Exportación a PDF y Excel
- **Base de Datos Completa**: 400+ centros CCSS y 300+ puestos del manual oficial

### 🎨 Características Avanzadas
- **PWA Completa**: Instalable, funciona offline
- **Responsive Design**: Optimizada para móvil, tablet y desktop
- **Modo Claro/Oscuro**: Tema adaptable
- **Notificaciones**: Alertas de vencimiento de nombramientos
- **Backup/Restauración**: Exporta e importa tus datos
- **Gráficos Interactivos**: Estadísticas visuales con Chart.js
- **Búsqueda Inteligente**: Filtros por centros y puestos
- **Validaciones**: Sistema robusto de validación de datos

## 🚀 Instalación Rápida

### Opción 1: Servidor Local (Recomendado)

```bash
# 1. Instalar servidor HTTP
npm install -g http-server

# 2. Navegar al directorio
cd mis-nombramientos

# 3. Iniciar servidor
http-server -p 8080

# 4. Abrir en navegador
# http://localhost:8080
```

### Opción 2: Python

```bash
cd mis-nombramientos
python -m http.server 8080
```

### Opción 3: VS Code Live Server

1. Instalar extensión "Live Server"
2. Abrir carpeta `mis-nombramientos`
3. Click derecho en `index.html` → "Open with Live Server"

## 📱 Instalación como PWA

1. Abre la aplicación en tu navegador
2. Click en ícono de instalación (Chrome/Edge)
3. En móvil: "Agregar a pantalla de inicio"
4. ¡Funciona como app nativa!

## 📁 Estructura del Proyecto

```
mis-nombramientos/
├── index.html              # Página principal (421 líneas)
├── css/
│   └── styles.css          # Estilos (1,197 líneas)
├── js/
│   ├── app.js              # Lógica principal (963 líneas)
│   ├── db.js               # IndexedDB (482 líneas)
│   ├── charts.js           # Gráficos (340 líneas)
│   ├── reports.js          # PDF/Excel (516 líneas)
│   └── notifications.js    # Notificaciones (278 líneas)
├── data/
│   ├── centros-ccss.js     # 400+ centros (333 líneas)
│   └── puestos-ccss.js     # 300+ puestos (312 líneas)
├── assets/
│   └── logo.png            # Logo mono programador
├── manifest.json           # Configuración PWA
└── service-worker.js       # Cache offline
```

**Total: 4,842 líneas de código**

## 🎯 Guía Rápida de Uso

### 1️⃣ Crear Nombramiento

1. Click en "Nuevo Nombramiento"
2. Selecciona **Centro CCSS** (busca por nombre)
3. Ingresa **Fechas** (Desde - Hasta)
4. Selecciona **Puesto** (del manual CCSS)
5. Elige **Tipo**: Interino/Ascenso/Otros
6. (Opcional) Activa **Tiempo Extraordinario**
7. Guardar

### 2️⃣ Tiempo Extraordinario

**Al crear nombramiento:**
- Toggle "Tiempo Extra" → ON
- Ingresar horas
- Seleccionar fecha

**Agregar después:**
- Click en nombramiento → "Agregar Tiempo Extra"

### 3️⃣ Prórrogas

- Selecciona nombramiento
- Click "Prórroga"
- Nueva fecha de finalización
- ¡Recalcula automáticamente!

### 4️⃣ Generar Reportes

**PDF:**
- Dashboard → "Generar PDF"
- Incluye logo, tablas, estadísticas

**Excel:**
- Dashboard → "Exportar Excel"
- Múltiples hojas con datos detallados

## 📊 Base de Datos Incluida

### Centros CCSS (400+)
- EBAIS (100+)
- Clínicas (80+)
- Hospitales Nacionales (29)
- Áreas de Salud (100+)
- Otros centros administrativos

### Puestos (300+)
Del Manual Oficial CCSS:
- Profesionales en Salud
- Técnicos especializados
- Administrativos
- Servicios de apoyo

## 🔒 Seguridad

✅ **100% Local** - Datos solo en tu dispositivo  
✅ **Sin servidor** - No envía info a internet  
✅ **IndexedDB** - Base de datos segura  
✅ **Offline First** - Funciona sin conexión  
✅ **Backups** - Control total de tus datos  

## 🛠️ Tecnologías

- HTML5 + CSS3 (Grid, Flexbox)
- JavaScript ES6+ (Modular)
- IndexedDB (Persistencia)
- Chart.js (Gráficos)
- jsPDF (Reportes PDF)
- SheetJS (Excel)
- Service Worker (Offline)
- PWA Manifest

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| No se instala como PWA | Usa HTTPS o localhost |
| Datos no se guardan | Verifica permisos IndexedDB |
| Notificaciones no llegan | Permite notificaciones en navegador |
| Error en reportes | Verifica que haya datos completos |

## 📈 Estadísticas del Proyecto

- 📝 4,842 líneas de código
- 🗂️ 10 archivos principales
- 🏥 400+ centros CCSS
- 👔 300+ puestos oficiales
- ⚡ 80+ funciones
- 🎨 Responsive: móvil/tablet/desktop

## 🚀 Características Premium

✨ **Dashboard Interactivo**
- Resumen en tiempo real
- 4 tipos de gráficos
- Filtros avanzados

✨ **Reportes Profesionales**
- PDF con logo corporativo
- Excel multi-hoja
- Cálculos automáticos

✨ **Gestión Inteligente**
- Validaciones robustas
- Cálculo automático de días
- Búsqueda instantánea

✨ **Notificaciones**
- Alertas de vencimiento
- Recordatorios personalizados
- Control de anticipación

## 📞 Características Únicas

1. **Búsqueda Inteligente**: Encuentra centros y puestos al instante
2. **Cálculos Automáticos**: Días totales, prórrogas, tiempo extra
3. **Historial Completo**: Registro de todos los cambios
4. **Modo Oscuro**: Protege tu vista
5. **Backup Seguro**: Exporta/importa tus datos
6. **Gráficos Dinámicos**: Visualiza tendencias
7. **Validación Robusta**: Previene errores de entrada

## 🎓 Manual de Usuario

### Flujo Típico de Trabajo

```
1. Crear Nombramiento
   ↓
2. Registrar Tiempo Extra (si aplica)
   ↓
3. Monitorear en Dashboard
   ↓
4. Extender con Prórroga (si necesario)
   ↓
5. Generar Reportes
   ↓
6. Backup de Datos
```

### Mejores Prácticas

- ✅ Registra nombramientos al inicio
- ✅ Actualiza tiempo extra regularmente
- ✅ Revisa dashboard semanalmente
- ✅ Exporta reportes mensualmente
- ✅ Haz backup antes de cambios importantes

## 🔄 Actualizaciones

**Versión 1.0.0** (Actual)
- ✅ Gestión completa de nombramientos
- ✅ Tiempo extraordinario
- ✅ Prórrogas automáticas
- ✅ Dashboard con gráficos
- ✅ Reportes PDF/Excel
- ✅ 400+ centros CCSS
- ✅ 300+ puestos oficiales
- ✅ PWA completa

## 💡 Tips y Trucos

1. **Búsqueda Rápida**: Escribe solo 3 letras para filtrar
2. **Atajos**: Usa Tab para navegar entre campos
3. **Filtros**: Combina múltiples filtros en dashboard
4. **Backup**: Exporta datos antes de actualizaciones
5. **Modo Oscuro**: Mejor para trabajo nocturno

---

## ⚡ Inicio Rápido (60 segundos)

```bash
# 1. Descomprimir
unzip mis-nombramientos.zip

# 2. Iniciar servidor
cd mis-nombramientos && python -m http.server 8080

# 3. Abrir navegador
# http://localhost:8080

# 4. ¡Listo para usar!
```

---

**Desarrollado con ❤️ y 🐵 para profesionales de la CCSS**

*Versión 1.0.0 - Marzo 2024*
