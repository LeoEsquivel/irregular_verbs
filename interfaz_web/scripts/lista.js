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
    if (lista_verbos.length === 0) return [[], [], []];

    const indice2daparte = encontrar_indice(lista_verbos, 'K');
    const indice3raparte = encontrar_indice(lista_verbos, 'U');

    const lista1 = lista_verbos.slice(0, indice2daparte);
    const lista2 = lista_verbos.slice(indice2daparte, indice3raparte);
    const lista3 = lista_verbos.slice(indice3raparte);

    return [lista1, lista2, lista3];
}

const encontrar_indice = (arreglo, letra) => {
    if (arreglo.length === 0) return 0;

    const primera_letra = arreglo[0].charAt(0).toUpperCase();
    const ultima_letra = arreglo[arreglo.length - 1].charAt(0).toUpperCase();

    if (primera_letra >= letra) return 0;
    if (ultima_letra < letra) return arreglo.length - 1;

    let inicio = 0;
    let fin = arreglo.length - 1;

    while (inicio <= fin) {
        const medio = Math.floor((inicio + fin) / 2);
        if (arreglo[medio].charAt(0).toUpperCase() < letra) {
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

const crear_lista = (contenedor, lista) => {
    let letra_actual = undefined;
    let seccion      = undefined;
    let lista_actual = undefined;
    lista.forEach((verb, index) => {
        if(letra_actual !== verb.charAt(0).toUpperCase()){
            letra_actual = lista[index].charAt(0).toUpperCase();
            seccion = template_seccion(letra_actual);
            contenedor.appendChild(seccion);
            lista_actual = document.getElementById(`lista_${letra_actual}`);
        }

        const lista_item = document.createElement('li');
        lista_item.classList.add('verbos_item');
        // lista_item.innerHTML = `<a href="/${verb}">${verb}</a>`;
        lista_item.innerHTML = `<a href="#">${verb}</a>`;
        lista_item.setAttribute('id', verb);
        lista_actual.appendChild(lista_item);
    });
}

const template_seccion = (letra) => {
    const contenedor = document.createElement('div');
    contenedor.classList.add('contenedor-verbos');

    contenedor.innerHTML = `
        <div class="verbos_titulo">${letra}</div>
        <hr style="margin: 0;">
        <ul id="lista_${letra}" class="verbos_lista"></ul>
    `;
    return contenedor;
}

const main = async () => {
    let lista_verbos = await obtener_verbos();
    lista_verbos = ordenar_verbos(lista_verbos);
    const [lista1, lista2, lista3] = separar_lista(lista_verbos);

    const contenedor1 = document.getElementById('contenedor-lista1');
    const contenedor2 = document.getElementById('contenedor-lista2');
    const contenedor3 = document.getElementById('contenedor-lista3');

    crear_lista(contenedor1, lista1);
    crear_lista(contenedor2, lista2);
    crear_lista(contenedor3, lista3);

}


main();