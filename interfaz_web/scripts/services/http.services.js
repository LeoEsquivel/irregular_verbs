export const get_verbs = async () => {
    return fetch('./data/irregular_verbs_list.json')
        .then(response => response.json())
        .then(data => data); 
    }
