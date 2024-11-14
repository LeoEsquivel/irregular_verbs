// Cache elementos de plantillas cargadas.
const templateCache = {}; //Cache HTML crudo
const processedCache = {};

/**
 * Carga una plantilla desde un archivo HTML externo e inserta su contenido en un contenedor.
 * Utiliza caché para evitar cargar el archivo más de una vez.
 * @param {string} filePath - Ruta del archivo HTML que contiene la plantilla.
 * @param {string} templateId - ID del elemento <template> en el archivo externo.
 * @param {string} containerId - ID del contenedor donde se insertará la plantilla.
 */
export async function loadTemplate(templatePath, templateId, containerId) {
    try {
      // Verificar si ya se ha procesado esta plantilla
      if (processedCache[templateId]) {
        console.log(`Usando plantilla procesada desde caché: ${templateId}`);
        document.getElementById(containerId).innerHTML = processedCache[templateId];
        return;
      }

      // Verificar si la plantilla cruda ya está en caché
      if (!templateCache[templatePath]) {
        console.log(`Cargando plantilla desde archivo: ${templatePath}`);
        const response = await fetch(templatePath);
        const html = await response.text();
        templateCache[templatePath] = html;
      }

      // Insertar y procesar la plantilla
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = templateCache[templatePath];
      insertTemplate(tempDiv, templateId, containerId);
      
      // Guardar la versión procesada en caché
      processedCache[templateId] = document.getElementById(containerId).innerHTML;
    } catch (error) {
      console.error('Error al cargar la plantilla:', error);
    }
}

/**
 * Inserta el contenido de una plantilla en el contenedor especificado.
 * @param {HTMLElement} tempDiv - Elemento temporal que contiene la plantilla.
 * @param {string} templateId - ID de la plantilla a insertar.
 * @param {string} containerId - ID del contenedor donde se insertará la plantilla.
 */
function insertTemplate(tempDiv, templateId, containerId) {
    const template = tempDiv.querySelector(`#${templateId}`);
    const container = document.getElementById(containerId);
    console.log(container)
    if (!template && !container) {
      console.error('No se encontró la plantilla o el contenedor');
      return;
    } 

    container.innerHTML = template.innerHTML;
    console.log(`Plantilla '${templateId}' insertada en el contenedor '${containerId}'`);
    // Ejecutar los scripts internos
    executeScripts(containerId);
  }

/**
 * Ejecuta los scripts internos que se encuentran dentro del contenedor especificado.
 * @param {string} containerId - ID del contenedor donde se han insertado los scripts.
 */
function executeScripts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Seleccionar todos los scripts embebidos
  const scripts = container.querySelectorAll('script');

  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.type = script.type || 'text/javascript';

    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }

    script.parentNode.replaceChild(newScript, script);
  });

  console.log('Scripts internos ejecutados');
}