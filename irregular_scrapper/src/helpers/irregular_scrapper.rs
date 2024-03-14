use scraper::Element;
use scraper::{Html, Selector};

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

    pub fn get_page(&self) -> &Html {
        &self.page
    }

}