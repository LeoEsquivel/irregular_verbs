use std::{fs::File, io::Write};

use crate::models::irregular_verb::IrregularVerb;

pub fn create_json(data: Vec<IrregularVerb>) {
    println!("Creating JSON");
    let json = serde_json::to_string(&data);
    let mut json_file = File::create("irregular_verbs_list.json").expect("Error al crear el archivo");
    json_file.write_all(json.unwrap().as_bytes()).expect("No se pudo escribir el archivo");
}