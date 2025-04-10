import { get_verbs } from './services/http.services.js';
import { eventManager } from '../einaudi/eventdelegationmanager.js';

const d = document;
const verbos = {};

const obtener_verbos = async () => {
    const verbos_response = await get_verbs();
    return verbos_response.forEach(verbo => {
        const clave = verbo.infinitive.toLowerCase().replace(/^to\s+/, "");
        verbos[clave] = verbo;
    });
}

const llenar_info = (verbo_info) => {
    const { infinitive, simple_past, past_participle, translation, eng_example, esp_example } = verbo_info;
    
    d.getElementById('infinitive').innerText = infinitive;
    d.getElementById('simple_past').innerText = simple_past;
    d.getElementById('past_participle').innerText = past_participle;
    d.getElementById('tooltip_trans').setAttribute('tooltip', translation);
    create_tr(eng_example, esp_example);
}

eventManager.addEventListener("#actualizar", "click", () => {
    const verbo = location.hash.split("#")[1];
    const info_verbo = verbos[verbo];
    llenar_info(info_verbo);
});

// TODO: Refactorizar, mismas funciones en index.js
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

const main = async () => {
    const verbo = location.hash.split("#")[1];
    await obtener_verbos();
    const info_verbo = verbos[verbo];
    llenar_info(info_verbo);
}

main();