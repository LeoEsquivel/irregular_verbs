use scraper::html::Select;
use scraper::{selector, Element, ElementRef};
use scraper::{Html, Selector};

use crate::models::irregular_verb::{self, IrregularVerb};

pub struct IrregularScrapper {
    page: Html,

}

impl IrregularScrapper {

    pub fn new(url: String) -> IrregularScrapper {
        let response = reqwest::blocking::
            get(url.clone()).unwrap()
                .text().unwrap();

        let document = Html::parse_document(&response);

        IrregularScrapper {
            page: document
        } 
    }

    fn get_table(&self) -> Vec<ElementRef>{
        let selector = Selector::parse("tbody > tr").unwrap();

        let html_tbody = self.page.select(&selector);
 
        html_tbody.skip(1).collect()
    }

    fn get_data(&self, tr: ElementRef<'_>) -> IrregularVerb {
        let selector = Selector::parse("td").unwrap();
        let mut td_elements = tr.select(&selector);
        
        let infinitive     = td_elements.next().unwrap().inner_html();
        let simple_past    = td_elements.next().unwrap().inner_html();
        let past_participle= td_elements.next().unwrap().inner_html(); 
        let eng_example    = td_elements.next().unwrap().inner_html(); 
        let esp_example    = td_elements.next().unwrap().inner_html();

        let irregular_verb = IrregularVerb::new(infinitive, simple_past, past_participle, eng_example, esp_example);
        irregular_verb
    }

    pub fn get_verbs_list(&self) -> Vec<IrregularVerb>  {
        println!("Get list of verbs");
        
        let tbody = self.get_table();
        let mut verbs_list: Vec<IrregularVerb> = Vec::new();
        for element in tbody {
            let irregular_verb = self.get_data(element);
            verbs_list.push(irregular_verb)
        }
        verbs_list
    }

}