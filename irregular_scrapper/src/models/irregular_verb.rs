use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct IrregularVerb {
    pub infinitive      : String,
    pub simple_past     : String,
    pub past_participle : String
}

impl IrregularVerb {

    pub fn new(infinitive: String, simple_past: String, past_participle: String) -> IrregularVerb {
        IrregularVerb {
            infinitive,
            simple_past,
            past_participle
        }
    }
}
