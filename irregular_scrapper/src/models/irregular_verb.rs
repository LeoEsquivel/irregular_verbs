use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct IrregularVerb {
    pub infinitive      : String,
    pub simple_past     : String,
    pub past_participle : String,
    pub translation     : String,
    pub eng_example     : String,
    pub esp_example     : String
}

impl IrregularVerb {

    pub fn new(infinitive: String, simple_past: String, past_participle: String, translation: String, eng_example: String, esp_example: String) -> IrregularVerb {
        IrregularVerb {
            infinitive,
            simple_past,
            past_participle,
            translation,
            eng_example,
            esp_example
        }
    }
}
