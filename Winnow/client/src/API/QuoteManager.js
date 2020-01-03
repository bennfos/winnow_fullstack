//import fetchJsonp from 'fetch-jsonp'
import { createAuthHeaders } from '../API/userManager';

const baseUrl = "/api/v1"

export default {

//All methods that fetch the quote data, with varying parameters and/or methods

    getAllUserQuotes() {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes`, {
            headers: authHeader
        })
        .then(response => response.json());
    },
    getPageQuotes(pageId) {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes/${pageId}`, {
            headers: authHeader
        })
        .then(response => response.json());
    },
    queryUserQuotes(searchInput) {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes?search=${searchInput}`, {
            headers: authHeader
        })
        .then(response => response.json());
    },

    getQuote(id) {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes/${id}`, {
            headers: authHeader
        })
        .then(response => response.json());
    },
    postQuote(quoteObject) {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes`, {
            method: "POST",
            headers: authHeader,
            body: JSON.stringify(quoteObject)
        }).then(response => response.json())
    },
    editQuote (id, editedQuote) {
        const authHeader = createAuthHeaders();
        return fetch (`${baseUrl}/quotes/${id}`,  {
            method: "PUT",
            headers: authHeader,
            body: JSON.stringify(editedQuote)
        }).then(response => response.json());
    },    
    deleteQuote(id) {
        const authHeader = createAuthHeaders();
        return fetch(`${baseUrl}/quotes/${id}`,
        {method: "DELETE",
        headers: authHeader,
        }).then(response => response.json())
    }
    //,
    // getRandomQuote () {      
    //     return fetchJsonp('http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en',
    //         {jsonpCallback: 'jsonp'})
    //         .then(function(response) {
    //         return response.json();
    //     })
    // }
}