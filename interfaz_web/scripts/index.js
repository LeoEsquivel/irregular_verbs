import { get_verbs } from './services/http.services.js';
import { SlotMachine } from './slot_machine.js';
import { eventManager } from '../einaudi/eventdelegationmanager.js';


const d = document;
const tbody_example = d.getElementById("tbody_example")

const slot_machine = new SlotMachine();

eventManager.addEventListener('#btn_get_verb','click', async (e) => {

    if(slot_machine.getSize() == 0) {
        const verbs_list = await get_verbs();
        slot_machine.setVerbList(verbs_list);
    }

    const { infinitive, simple_past, past_participle, 
            translation, eng_example, esp_example } = slot_machine.getRandomVerb();
    d.getElementById('infinitive').innerText = infinitive;
    d.getElementById('simple_past').innerText = simple_past;
    d.getElementById('past_participle').innerText = past_participle;
    d.getElementById('tooltip_trans').setAttribute('tooltip', translation);
    debugger
    create_tr(eng_example, esp_example)
});

const create_tr = (eng_example = '', esp_example = '') => {
    tbody_example.innerHTML = "";
    
    const tr = d.createElement("tr");

    tr.appendChild(create_td(eng_example))
    tr.appendChild(create_td(esp_example))
    console.log(tr);
    tbody_example.appendChild(tr);
    console.log(tbody_example);
    tbody_example.closest("table").style.display = "";
    
}

const create_td = (text_value = '') => {
    const td = d.createElement("td");
    td.classList.add("text-center")
    td.innerText = text_value;
    return td
}