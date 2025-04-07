import { eventManager } from '../einaudi/eventdelegationmanager.js';
import { get_verbs } from './services/http.services.js';

const obtener_verbos = async () => {
    const verbos = await get_verbs();
    return verbos.map(verb => verb.infinitive.split(' ')[1])
}

const ordenar_verbos = (lista_verbos) => {
    const collocator = new Intl.Collator('en', { sensitivity: 'base' });
    return lista_verbos.sort(collocator.compare);      
}

const separar_lista = (lista_verbos) => {
    if(lista_verbos.length === 0) return [[],[],[]];

    const indice2daparte = encontrar_indice(lista_verbos, 'K');
    const indice3raparte = encontrar_indice(lista_verbos, 'U');

    const contenedor1 = lista_verbos.slice(0, indice2daparte);
    const contenedor2 = lista_verbos.slice(indice2daparte, indice3raparte);
    const contenedor3 = lista_verbos.slice(indice3raparte);

    console.log({contenedor1, contenedor2, contenedor3});
}

const encontrar_indice = (arreglo, letra) => {
    if(arreglo.length === 0) return 0;

    const primera_letra = arreglo[0].charAt(0).toUpperCase();
    const ultima_letra = arreglo[arreglo.length - 1].charAt(0).toUpperCase();

    if(primera_letra >= letra) return 0;
    if(ultima_letra < letra) return arreglo.length -1;

    let inicio = 0;
    let fin = arreglo.length - 1;

    while (inicio <= fin) {
        const medio = Math.floor((inicio + fin) / 2);
         if(arreglo[medio].charAt(0).toUpperCase() < letra) {
            inicio = medio + 1;
        } else {
            fin = medio;
        }

        if (inicio === fin) {
            return inicio;
        }
    }

    return inicio;
}

const crear_lista = (contenedor) => {
    // const 
}

const main = async () => {
    let lista_verbos = await obtener_verbos();
    lista_verbos     = ordenar_verbos(lista_verbos);
    separar_lista(lista_verbos);
}


main();