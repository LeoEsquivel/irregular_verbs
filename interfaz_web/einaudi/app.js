import { stateManager } from "./stateManager.js";

/**
 * Cache de plantillas para evitar múltiples cargas.
 * @type {Map<string, string>}
 */
const templateCache = new Map();

/**
 * Carga una plantilla desde un archivo HTML externo y la inserta en un contenedor.
 * Utiliza caché para evitar cargar el archivo más de una vez.
 * Restaura el estado usando el StateManager.
 * @async
 * @param {string} templatePath - Ruta del archivo HTML que contiene la plantilla.
 * @param {string} templateId   - ID del elemento <template> en el archivo externo.
 * @param {string} containerId  - ID del contenedor donde se insertará la plantilla.
 * @returns {Promise<void>}
 */
export const loadTemplate = async (templatePath, templateId, containerId) => {
  try {
    const container = document.getElementById(containerId);

    //Verificar si la plantilla ya está en caché
    let html = templateCache.get(templateId);
    if(!html){
      // Cargar desde el archivo si no esta en caché y guardarlo.
      const response = await fetch(templatePath);
      html = await response.text();

      templateCache.set(templateId, html);
    } 

    // Insertar plantilla en el contenedor.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Seleccionar el template y clonarlo
    const templateElement = tempDiv.querySelector(`#${templateId}`);

    if (templateElement) {
      const templateContent = templateElement.content.cloneNode(true);
      container.innerHTML = ''; // Limpiar el contenedor
      container.appendChild(templateContent);

      // Ejecutar scripts dentro de la plantilla
      runScripts(container);
    }

    // Restaurar el estado si existe.
    const savedState = stateManager.getState(templateId);
    
    if(savedState) {
      applyStateToDOM(savedState);
    }

    // //Ejecuta scripts
    // runScripts(containerId);

  } catch (error) {
    console.error(`Error al cargar la plantilla ${templateId}:`, error);
  }
};

/**
 * Aplica el estado guardado en el DOM.
 * @param {Object} state - Objeto de estado con pares de ID de elementos y sus valores.
 */
const applyStateToDOM = (state) => {
  debugger
  Object.entries(state).forEach(([ id, { type, value } ]) => {
    const element = document.querySelector(id);
    if(type === "childList" && element) {
      element.replaceWith(value);
    } else if (type === "style" && element){
      element.style.cssText = value;
    }
  });
};

/**
 * Ejecuta los scripts contenidos en el HTML cargado.
 * @param {string} containerId - ID del contenedor donde se han insertado los scripts.
 */
const runScripts = (container) => {
  container.querySelectorAll('script').forEach((script) => {
      const newScript = document.createElement('script');
      newScript.type = script.type || 'text/javascript';

      // Si el script es un módulo, lo tratamos como tal
      if (script.type === 'module') {
          newScript.type = 'module';
      }

      // Clonar el contenido del script original
      if (script.src) {
          newScript.src = script.src;
      } else {
          newScript.textContent = script.textContent;
      }

      // Insertar y ejecutar el script
      container.appendChild(newScript);
  });
};