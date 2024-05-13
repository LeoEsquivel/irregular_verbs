import { get_verbs } from './services/http.services.js';
import { SlotMachine } from './slot_machine.js';

const d = document;
const btn_get_verb  = d.getElementById('btn_get_verb');
const tbody_example = d.getElementById("tbody_example")

const slot_machine = new SlotMachine();

btn_get_verb.addEventListener('click', (e) => {
    const { infinitive, simple_past, past_participle, 
            translation, eng_example, esp_example } = slot_machine.getRandomVerb();

    d.getElementById('infinitive').innerText = infinitive;
    d.getElementById('simple_past').innerText = simple_past;
    d.getElementById('past_participle').innerText = past_participle;
    d.getElementById('tooltip_trans').setAttribute('tooltip', translation);
    create_tr(eng_example, esp_example)
});

d.addEventListener('DOMContentLoaded', async () => {
    const verbs_list = await get_verbs();
    slot_machine.setVerbList(verbs_list);
});


const create_tr = (eng_example = '', esp_example = '') => {
    tbody_example.innerHTML = "";
    
    const tr = d.createElement("tr");

    const td_eng = d.createElement("td");
    td_eng.innerText = eng_example;

    const td_esp = d.createElement("td");
    td_esp.innerText = esp_example;

    tr.appendChild(td_eng);
    tr.appendChild(td_esp);
    tbody_example.appendChild(tr);
    tbody_example.closest("table").style.display = "inline-block";


}