import { get_verbs } from './services/http.services.js';
import { SlotMachine } from './slot_machine.js';

const d = document;
const btn_get_verb = d.getElementById('btn_get_verb');

const slot_machine = new SlotMachine();

btn_get_verb.addEventListener('click', (e) => {
    const { infinitive, simple_past, past_participle, 
            translation, eng_example, esp_example } = slot_machine.getRandomVerb();

    d.getElementById('infinitive').innerText = infinitive;
    d.getElementById('simple_past').innerText = simple_past;
    d.getElementById('past_participle').innerText = past_participle;

});


d.addEventListener('DOMContentLoaded', async () => {
    const verbs_list = await get_verbs();
    slot_machine.setVerbList(verbs_list);

});
