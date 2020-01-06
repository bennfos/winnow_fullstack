import React, { Component } from 'react';
import { Input, InputGroup } from 'reactstrap';
import QuoteManager from '../../API/QuoteManager';
import SearchResultCard from './SearchResultCard';
//import './Search.css'


class Search extends Component {

        state = {
            quotes: [],
            searchInput: "",
            searchResults: [],
            initialMessage: "",
            loadingStatus: true
        }


    handleFieldChange = (event) => {
        const stateToChange = {};
        stateToChange[event.target.id] = event.target.value;
        this.setState(stateToChange);
    }

    searchPageQuotes = () => {           
        //4. Filter the quotes to include only those object whose quoteText, quoteAuthor or month include the search input value
        this.setState({initialMessage: ""})    
        const searchResults = this.state.quotes.filter(quote =>
                quote.quoteText.toLowerCase().includes(this.state.searchInput.toLowerCase())
                || quote.quoteAuthor.toLowerCase().includes(this.state.searchInput.toLowerCase())
                || quote.page.month.toLowerCase().includes(this.state.searchInput.toLowerCase())
                || quote.page.thought.toLowerCase().includes(this.state.searchInput.toLowerCase()))
                if (this.state.loadingStatus == false ) {
                    this.setState({ searchResults: searchResults})   
                }
    }

    componentDidMount () {
        QuoteManager.getAllUserQuotes(this.state.searchInput)
            .then(quotes => {
                this.setState({
                    quotes: quotes,
                    initialMessage: "search and you shall find",
                    loadingStatus: false                
                })           
            })
        }
    


    render() {
        return (
            <React.Fragment>
                <div className="search__container">
                    <div className="search__input">
                        <InputGroup size="lg">
                        <Input
                            onChange={this.handleFieldChange}
                            onKeyUp={this.searchPageQuotes}
                            type="text"
                            id="searchInput"
                            placeholder="search by text, author, or month"
                            value={this.state.searchInput}
                            autoFocus>
                        </Input>
                        </InputGroup>
                    </div>
                    <div className="results__container">
                        {this.state.searchResults.map(searchResult => (
                    <SearchResultCard
                      key={searchResult.id}
                      searchResult={searchResult}
                      {...this.props}/>
                  ))}
                  {this.state.initialMessage}
                  </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Search;
