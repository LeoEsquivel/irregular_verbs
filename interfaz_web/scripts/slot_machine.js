export class SlotMachine {

// {
//     "infinitive": "To awake",
//     "simple_past": "Awoke",
//     "past_participle": "Awoken",
//     "translation": "Despertar",
//     "eng_example": "I was awoken in the middle of the night by a loud bang.",
//     "esp_example": "Me despertó un gran estruendo en mitad de la noche."
// }

    #verbs_list  = [];
    #total_verbs = 0;
    #verbs_used  = [];

    constructor() {
        this.#verbs_used = JSON.parse(localStorage.getItem("verbs_used"));
        if(this.#verbs_used === null) {
            this.#verbs_used = [];
            localStorage.setItem("verbs_used", JSON.stringify([]));
        }
    }

    setVerbList(verb_list = []) {
        if(verb_list.length <= 0) {
            return Error("Lista de verbos vacia.");
        }

        this.#verbs_list = verb_list;
        this.#updateVerbLength(this.#verbs_list);
    }

    #updateVerbLength(list) {
        this.#total_verbs = list.length;
    }

    getRandomVerb() {
        if (this.#total_verbs <= 0) return Error("Lista de verbos vacia.");

        const random_number = Math.floor(Math.random() * this.#total_verbs);
        
        const verb = this.#verbs_list[random_number];
        if (this.#verbs_used.includes(verb.infinitive)) {
            return this.getRandomVerb();
        }
        
        this.#updateListVerbsUsed(verb);
        return verb
    }

    #updateListVerbsUsed(verb) {
        this.#verbs_used.push(verb.infinitive);
        localStorage.setItem("verbs_used", JSON.stringify(this.#verbs_used));
    }


}