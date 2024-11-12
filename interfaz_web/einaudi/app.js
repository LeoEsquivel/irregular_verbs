// Cache elementos de plantillas cargadas.
const templateCache = {};

/**
 * Carga una plantilla desde un archivo HTML externo e inserta su contenido en un contenedor.
 * Utiliza caché para evitar cargar el archivo más de una vez.
 * @param {string} filePath - Ruta del archivo HTML que contiene la plantilla.
 * @param {string} templateId - ID del elemento <template> en el archivo externo.
 * @param {string} containerId - ID del contenedor donde se insertará la plantilla.
 */
export async function loadTemplate(filePath, templateId, containerId) {
    try {
      // Verificar si la plantilla ya está en caché
      if (templateCache[filePath]) {
        console.log(`Plantilla desde caché: ${templateId}`);
        insertTemplate(templateCache[filePath], templateId, containerId);
        return;
      }
  
      // Cargar el archivo HTML externo
      const response = await fetch(filePath);
      const htmlText = await response.text();
  
      // Crear un elemento temporal para parsear el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlText;
  
      // Guardar el contenido en caché
      templateCache[filePath] = tempDiv;
  
      // Insertar la plantilla
      insertTemplate(tempDiv, templateId, containerId);
      executeScripts(containerId);
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
  
    if (template && container) {
      container.insertAdjacentHTML('beforeend', template.innerHTML);
      console.log(`Plantilla '${templateId}' insertada en el contenedor '${containerId}'`);
    } else {
      console.error('No se encontró la plantilla o el contenedor');
    }
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
    // Copiar el contenido y los atributos del script original
    if (script.src) {
      newScript.src = script.src;
      newScript.type = "module";
    } else {
      newScript.textContent = script.textContent;
      newScript.type = "module";
    }
    Array.from(script.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value)
    );
    // Reemplazar el script para que se ejecute
    script.parentNode.replaceChild(newScript, script);
  });

  console.log('Scripts internos ejecutados');
}