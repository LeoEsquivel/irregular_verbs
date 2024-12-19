export const get_verbs = async () => {
    return fetch('./data/irregular_verbs_list.json')
        .then(response => response.json())
        .then(data => data); 
    }

export const get_verbs_temp = async () => {
    return fetch('../data/irregular_verbs_list.json')
        .then(response => response.json())
        .then(data => data); 
    }