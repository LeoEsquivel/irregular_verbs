import { eventManager } from '../einaudi/eventdelegationmanager.js';
import { get_verbs } from './services/http.services.js';


const d = document;
const modalBackdrop = document.getElementById('modalBackdrop');
const modal = document.getElementById("modal_info_verb");

const lista_verbos_ordenados = [];

const obtener_verbos = async () => {
    const verbos = await get_verbs();
    return verbos.map(verb => {
        return {
            'infinitive': verb.infinitive.split(' ')[1],
            "simple_past": verb.simple_past,
            "past_participle": verb.past_participle,
            "translation": verb.translation,
            "eng_example": verb.eng_example,
            "esp_example": verb.esp_example
        }
    })
}

const ordenar_verbos = (lista_verbos) => {
    const collocator = new Intl.Collator('en', { sensitivity: 'base' });
    return lista_verbos.sort((a, b) => collocator.compare(a['infinitive'], b['infinitive']));
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

    const primera_letra = arreglo[0].infinitive.charAt(0).toUpperCase();
    const ultima_letra = arreglo[arreglo.length - 1].infinitive.charAt(0).toUpperCase();

    if (primera_letra >= letra) return 0;
    if (ultima_letra < letra) return arreglo.length - 1;

    let inicio = 0;
    let fin = arreglo.length - 1;

    while (inicio <= fin) {
        const medio = Math.floor((inicio + fin) / 2);
        if (arreglo[medio].infinitive.charAt(0).toUpperCase() < letra) {
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
    let seccion = undefined;
    let lista_actual = undefined;
    lista.forEach((verb, index) => {
        if (letra_actual !== verb.infinitive.charAt(0).toUpperCase()) {
            letra_actual = lista[index].infinitive.charAt(0).toUpperCase();
            seccion = template_seccion(letra_actual);
            contenedor.appendChild(seccion);
            lista_actual = document.getElementById(`lista_${letra_actual}`);
        }

        const lista_item = document.createElement('li');
        lista_item.classList.add('verbos_item');
        lista_item.innerHTML = `<span data-verb="${verb.infinitive}" data-index=${index} class="verb">${verb.infinitive}</span>`;
        lista_item.setAttribute('id', verb.infinitive);
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

const create_tr = (eng_example = '', esp_example = '') => {
    const tbody_example = d.getElementById("tbody_example");

    tbody_example.innerHTML = "";
    tbody_example.closest("table").style.display = "table";

    const tr = d.createElement("tr");

    tr.appendChild(create_td(eng_example))
    tr.appendChild(create_td(esp_example))
    tbody_example.appendChild(tr);
}

const create_td = (text_value = '') => {
    const td = d.createElement("td");
    td.classList.add("text-center")
    td.innerText = text_value;
    return td
}

const abrir_modal = () => {
    modalBackdrop.style.display = 'block';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

const cerrar_modal = () => {
    modalBackdrop.style.display = 'none';
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

const mostrar_informacion_modal = (verb) => {
    const { infinitive, simple_past, past_participle, translation, eng_example, esp_example } = verb;

    const titulo_infinitive = titulo(infinitive);
    d.getElementById('infinitive').innerText = titulo_infinitive;
    d.getElementById('simple_past').innerText = simple_past;
    d.getElementById('past_participle').innerText = past_participle;
    d.getElementById('tooltip_trans').setAttribute('tooltip', translation);
    d.getElementById("verb").innerText = titulo_infinitive;
    create_tr(eng_example, esp_example);
}

const titulo = (texto) => {
    if (!texto) return texto;
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

eventManager.addEventListener(".verb", "click", (e) => {
    const index = e.target.dataset.index;
    const verbo_info = lista_verbos_ordenados[index]
    mostrar_informacion_modal(verbo_info);
    abrir_modal();
});

eventManager.addEventListener('.slot-text','dblclick', async (e) => {
    e.preventDefault();
    const { target } = e;
    const text = target.innerText;
    
    if(text === '') return;

    const message = new SpeechSynthesisUtterance(text);
    message.rate = 0.80;
    message.lang = "en-US";
    speechSynthesis.speak(message);
});

eventManager.addEventListener("#modalBackdrop", "click", () => {
    cerrar_modal();
});

eventManager.addEventListener("#modal_info_verb", "click", (e) => {
    const { target } = e;

    let elemento = target.closest("#btn_cerrar_x");
    if (elemento) {
        cerrar_modal();
        return
    }
});

eventManager.addEventListener('document', 'keydown', (e) => {
    if (e.key === 'Escape') {
        cerrar_modal();
    }
});

const main = async () => {
    let lista_verbos = await obtener_verbos();
    lista_verbos_ordenados.push(...ordenar_verbos(lista_verbos));
    const [lista1, lista2, lista3] = separar_lista(lista_verbos);

    const contenedor1 = document.getElementById('contenedor-lista1');
    const contenedor2 = document.getElementById('contenedor-lista2');
    const contenedor3 = document.getElementById('contenedor-lista3');

    crear_lista(contenedor1, lista1);
    crear_lista(contenedor2, lista2);
    crear_lista(contenedor3, lista3);

}


main();