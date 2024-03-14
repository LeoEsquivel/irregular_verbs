mod models;
mod helpers;
// use crate::models::irregular_verb::IrregularVerb;


use crate::helpers::irregular_scrapper::IrregularScrapper;

fn main() {
    let url = "https://www.berlitz.com/es-us/blog/verbos-irregulares-en-ingles";
    let mut irregular_scrapper = IrregularScrapper::new(url.to_string());

    println!("{:?}", irregular_scrapper.get_page())
}
