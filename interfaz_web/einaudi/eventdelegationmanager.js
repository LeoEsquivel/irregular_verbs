export class EventDelegationManager {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.eventMap = {};
        this.cache = new Set();
    
        // Registrar eventos a delegear
        ['click', 'keyup', 'hashchange'].forEach((eventType) => {
          this.container.addEventListener(eventType, (event) => this.handleEvent(event));
        });
      }

    /**
     * Registra un listener para un elemento específico
     * @param {string}   selector  - Selector del elemento.
     * @param {string}   eventType - Tipo de evento('click', etc).
     * @param {Function} callback  - Función de callback.
     */
    addEventListener(selector, eventType, callback) {
        const key = `${selector}-${eventType}`;

        //Evitar registrar duplicados.
        if (this.cache.has(key)) return;

        this.cache.add(key);
        
        // Arreglo de eventos, crea uno si no existe.
        if (!this.eventMap[eventType]) {
          this.eventMap[eventType] = [];
        }
        
        // Agregar el listener al map.
        this.eventMap[eventType].push({ selector, callback });
    }
    

    /**
     * Maneja los eventos delegados.
     * @param {Event} event - Objeto del evento.
     */
    handleEvent(event) {
        const { type, target } = event;

        if (!this.eventMap[type]) return;
        // Buscar y ejecutar el callback.
        this.eventMap[type].forEach(({ selector, callback }) => {
            if (selector === 'document' || selector === 'window') {
                callback(event);
            } else if (target.closest(selector)) {
                const matchedElement = target.closest(selector);
                if (matchedElement) {
                    callback(event);
                }
            }
        });
    }

    /**
     * Limpia la cache de listeners
     */
    clearCache(){
        this.cache.clear();
    }
}
export const eventManager = new EventDelegationManager('app-container');
