// Manual de Puestos de la CCSS
const PUESTOS_CCSS = [
  // Área Médica
  "Médico General 1",
  "Médico General 2",
  "Médico Especialista en Medicina General",
  "Médico Especialista en Medicina Interna",
  "Médico Especialista en Pediatría",
  "Médico Especialista en Ginecología y Obstetricia",
  "Médico Especialista en Cirugía General",
  "Médico Especialista en Anestesiología",
  "Médico Especialista en Traumatología y Ortopedia",
  "Médico Especialista en Cardiología",
  "Médico Especialista en Dermatología",
  "Médico Especialista en Oftalmología",
  "Médico Especialista en Otorrinolaringología",
  "Médico Especialista en Urología",
  "Médico Especialista en Neurología",
  "Médico Especialista en Psiquiatría",
  "Médico Especialista en Radiología",
  "Médico Especialista en Patología",
  "Médico Especialista en Medicina Física y Rehabilitación",
  "Médico Especialista en Oncología",
  "Médico Especialista en Nefrología",
  "Médico Especialista en Gastroenterología",
  "Médico Especialista en Endocrinología",
  "Médico Especialista en Neumología",
  "Médico Especialista en Reumatología",
  "Médico Especialista en Hematología",
  "Médico Especialista en Infectología",
  "Médico Especialista en Medicina de Emergencias",
  "Médico Especialista en Medicina Familiar y Comunitaria",
  "Médico Auditor",
  "Médico Residente",
  "Director Médico",
  "Jefe de Servicio Médico",
  "Coordinador Médico",
  
  // Área de Enfermería
  "Profesional en Enfermería 1",
  "Profesional en Enfermería 2",
  "Profesional en Enfermería 3",
  "Profesional en Enfermería Especialista",
  "Profesional en Enfermería de Salud Pública",
  "Profesional en Enfermería en Cuidados Intensivos",
  "Profesional en Enfermería Quirúrgica",
  "Profesional en Enfermería Pediátrica",
  "Profesional en Enfermería Obstétrica",
  "Profesional en Enfermería en Emergencias",
  "Auxiliar de Enfermería 1",
  "Auxiliar de Enfermería 2",
  "Técnico en Enfermería",
  "Asistente Técnico de Atención Primaria (ATAP)",
  "Director de Enfermería",
  "Jefe de Enfermería",
  "Coordinador de Enfermería",
  "Supervisor de Enfermería",
  
  // Área de Farmacia
  "Profesional en Farmacia 1",
  "Profesional en Farmacia 2",
  "Profesional en Farmacia 3",
  "Farmacéutico Especialista",
  "Técnico en Farmacia 1",
  "Técnico en Farmacia 2",
  "Auxiliar de Farmacia",
  "Regente de Farmacia",
  "Jefe de Farmacia",
  "Director de Farmacia",
  
  // Área de Laboratorio
  "Profesional en Microbiología y Química Clínica 1",
  "Profesional en Microbiología y Química Clínica 2",
  "Profesional en Microbiología y Química Clínica 3",
  "Técnico en Laboratorio Clínico 1",
  "Técnico en Laboratorio Clínico 2",
  "Auxiliar de Laboratorio",
  "Jefe de Laboratorio",
  "Director de Laboratorio",
  
  // Área de Radiología e Imágenes
  "Profesional en Radiología",
  "Técnico en Radiología 1",
  "Técnico en Radiología 2",
  "Técnico en Tomografía",
  "Técnico en Resonancia Magnética",
  "Técnico en Ultrasonido",
  "Auxiliar de Radiología",
  "Jefe de Radiología",
  
  // Área de Nutrición
  "Profesional en Nutrición 1",
  "Profesional en Nutrición 2",
  "Profesional en Nutrición 3",
  "Técnico en Nutrición",
  "Auxiliar de Nutrición",
  "Jefe de Nutrición",
  
  // Área de Trabajo Social
  "Trabajador Social 1",
  "Trabajador Social 2",
  "Trabajador Social 3",
  "Jefe de Trabajo Social",
  
  // Área de Psicología
  "Profesional en Psicología 1",
  "Profesional en Psicología 2",
  "Profesional en Psicología 3",
  "Psicólogo Clínico",
  "Jefe de Psicología",
  
  // Área de Fisioterapia
  "Profesional en Terapia Física 1",
  "Profesional en Terapia Física 2",
  "Profesional en Terapia Física 3",
  "Técnico en Terapia Física",
  "Asistente de Terapia Física",
  "Jefe de Terapia Física",
  
  // Área de Terapia Respiratoria
  "Profesional en Terapia Respiratoria 1",
  "Profesional en Terapia Respiratoria 2",
  "Técnico en Terapia Respiratoria",
  "Jefe de Terapia Respiratoria",
  
  // Área de Odontología
  "Odontólogo General 1",
  "Odontólogo General 2",
  "Odontólogo Especialista en Endodoncia",
  "Odontólogo Especialista en Periodoncia",
  "Odontólogo Especialista en Ortodoncia",
  "Odontólogo Especialista en Cirugía Maxilofacial",
  "Asistente Dental 1",
  "Asistente Dental 2",
  "Técnico en Prótesis Dental",
  "Jefe de Odontología",
  
  // Área de Registros Médicos
  "Profesional en Registros y Estadísticas de Salud 1",
  "Profesional en Registros y Estadísticas de Salud 2",
  "Técnico en Registros Médicos 1",
  "Técnico en Registros Médicos 2",
  "Auxiliar de Registros Médicos",
  "Jefe de Registros Médicos",
  
  // Área Administrativa
  "Profesional en Administración 1",
  "Profesional en Administración 2",
  "Profesional en Administración 3",
  "Administrador 1",
  "Administrador 2",
  "Administrador 3",
  "Administrador 4",
  "Director Administrativo",
  "Subdirector Administrativo",
  "Jefe Administrativo 1",
  "Jefe Administrativo 2",
  "Jefe Administrativo 3",
  "Coordinador Administrativo",
  "Asistente Administrativo 1",
  "Asistente Administrativo 2",
  "Auxiliar Administrativo 1",
  "Auxiliar Administrativo 2",
  "Oficinista 1",
  "Oficinista 2",
  "Recepcionista",
  
  // Área Financiera-Contable
  "Profesional en Contaduría 1",
  "Profesional en Contaduría 2",
  "Profesional en Contaduría 3",
  "Contador 1",
  "Contador 2",
  "Auditor 1",
  "Auditor 2",
  "Subauditor",
  "Técnico en Contabilidad 1",
  "Técnico en Contabilidad 2",
  "Auxiliar de Contabilidad",
  "Jefe de Contabilidad",
  
  // Área de Recursos Humanos
  "Profesional en Recursos Humanos 1",
  "Profesional en Recursos Humanos 2",
  "Profesional en Recursos Humanos 3",
  "Jefe de Recursos Humanos 1",
  "Jefe de Recursos Humanos 2",
  "Técnico en Recursos Humanos",
  "Auxiliar de Recursos Humanos",
  "Director de Recursos Humanos",
  
  // Área de Informática
  "Profesional en Informática 1",
  "Profesional en Informática 2",
  "Profesional en Informática 3",
  "Analista de Sistemas 1",
  "Analista de Sistemas 2",
  "Programador 1",
  "Programador 2",
  "Técnico en Informática 1",
  "Técnico en Informática 2",
  "Técnico en Soporte",
  "Administrador de Bases de Datos",
  "Administrador de Redes",
  "Jefe de Informática",
  "Director de Informática",
  
  // Área de Mantenimiento
  "Ingeniero en Mantenimiento",
  "Técnico en Mantenimiento 1",
  "Técnico en Mantenimiento 2",
  "Técnico en Electricidad",
  "Técnico en Refrigeración",
  "Técnico en Plomería",
  "Técnico en Carpintería",
  "Técnico en Pintura",
  "Operario de Mantenimiento",
  "Jefe de Mantenimiento",
  
  // Área de Servicios Generales
  "Auxiliar de Servicios Generales",
  "Conserje",
  "Portero",
  "Mensajero",
  "Conductor de Vehículo",
  "Conductor de Ambulancia",
  "Operador de Equipo Pesado",
  "Jefe de Servicios Generales",
  
  // Área de Seguridad
  "Oficial de Seguridad",
  "Vigilante",
  "Jefe de Seguridad",
  
  // Área de Lavandería
  "Operario de Lavandería",
  "Auxiliar de Lavandería",
  "Jefe de Lavandería",
  
  // Área de Alimentación
  "Cocinero 1",
  "Cocinero 2",
  "Auxiliar de Cocina",
  "Nutricionista de Alimentación",
  "Jefe de Alimentación",
  
  // Área de Bodega y Suministros
  "Profesional en Proveeduría",
  "Técnico en Bodega",
  "Auxiliar de Bodega",
  "Bodeguero",
  "Jefe de Bodega",
  "Encargado de Suministros",
  
  // Puestos de Dirección
  "Director General",
  "Subdirector General",
  "Director Médico",
  "Subdirector Médico",
  "Director de Área de Salud",
  "Coordinador de Área de Salud",
  "Gerente",
  "Subgerente",
  
  // Área Legal
  "Abogado 1",
  "Abogado 2",
  "Abogado 3",
  "Asesor Legal",
  "Jefe Legal",
  "Director Legal",
  
  // Área de Planificación
  "Planificador 1",
  "Planificador 2",
  "Planificador 3",
  "Jefe de Planificación",
  
  // Área de Comunicación
  "Profesional en Comunicación",
  "Periodista",
  "Relacionista Público",
  "Jefe de Comunicación",
  
  // Otros Profesionales
  "Ingeniero Civil",
  "Ingeniero Industrial",
  "Ingeniero Biomédico",
  "Arquitecto",
  "Estadístico",
  "Bibliotecólogo",
  "Educador en Salud"
].sort();

// Función de búsqueda de puestos
function buscarPuestos(query, limit = 10) {
  if (!query || query.length < 2) {
    return [];
  }
  
  const queryLower = query.toLowerCase();
  const results = PUESTOS_CCSS.filter(puesto => 
    puesto.toLowerCase().includes(queryLower)
  );
  
  return results.slice(0, limit);
}

// Función para verificar si un puesto existe
function validarPuesto(puesto) {
  return PUESTOS_CCSS.includes(puesto);
}
