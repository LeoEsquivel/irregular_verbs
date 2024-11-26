/**
 * Gestiona el estado temporal y persistente de la aplicación.
 * @class
 */
export class StateManager {

    constructor() {
        /**
         * Objeto para almacenar el estado temporal.
         * @type {Object}
         */
        this.state = {};
    }

    /**
     * Guarda el estado temporal.
     * @param {string} page - Pagina del estado.
     * @param {string} key  - Clave del estado a guardar.
     * @param {*} value     - Valor del estado a guardar.
     */
    setState(page, key, value) {
        if(!this.state[page]){
            this.state[page] = {}
        }
        this.state[page][key] = value;
    }

    /**
     * Obtiene el estado temporal.
     * @param {string} key - Clave del estado a obtener.
     * @returns {*} - Valor del estado a guardar.
     */
    getState(key) {    
        return this.state[key] || null;
    }

    /**
     * Guarda el estado de forma persistente en localstorage.
     * @param {string} key - Clave del estado a guardar.
     * @param {*} value - Valor del estado a guardar.
     */
    setPersistentState(key, value) {
        const now = new Date();
        const expiration = new Date(now.setHours(23, 59, 59, 999));

        localStorage.setItem(key, JSON.stringify({
            data: value,
            expires: expiration.getTime()
        }));
    }

    /**
     * Obtiene el estado persistente de localStorage.
     * @param {string} key - Clave del estado a obtener.
     * @returns {*} - Valor del estado, o null si ha expirado o no existe.
     */
    getPersistenState(key) {
        const item = JSON.parse(localStorage.getItem(key));
        if(!item) return null; 

        if(Date.now() > item.expires) {
            localStorage.removeItem(key);
            return null;
        }

        return item.data;
    }

    /**
     * Determina como se guardara el estado.
     * @param {string} page - Pagina del estado.
     * @param {string} key  - Clave del estado a guardar.
     * @param {*} value     - Valor del estado a guardar.
     * @param {bool} isPersistent - Si la información tiene que mantenerse aunque se cierre la pagina.
     */
    saveState(page, key, value, isPersistent = false) {
        if(isPersistent) {
            this.setPersistentState(page, key, value);
        } else {
            this.setState(page, key, value)
        }
    }

    loadState(key, isPersistent = false) {
        return isPersistent ? this.getPersistenState(key) : this.getState(key);
    }
}

export const stateManager = new StateManager(); 