import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import { Button } from 'semantic-ui-react'
//import '../Books/Card.css'



class SearchResultCard extends Component {
    state = {
        thoughtString: ""
    }
    
    componentDidMount() {
        if (this.props.searchResult.page.thought.length > 0) {
            this.setState({
                thoughtString: this.props.searchResult.page.thought
            })
        }
        if (this.props.searchResult.page.thought.length > 50) {
            let slicedThoughtString = this.props.searchResult.page.thought.slice(0, 50)
            this.setState({
                thoughtString: `${slicedThoughtString}...`
            })
        }               
    }
    
    render() {
    return (
        <>
            <div className="searchResult__card">
                <Card className="card__container">

                    <CardBody >
                        <div className="searchResult__card__header">
                            <h2>{this.props.searchResult.page.month} {this.props.searchResult.page.day}</h2>
                            <Button
                                as={Link}
                                to={`/books/${this.props.searchResult.page.bookId}/${this.props.searchResult.pageId}/${this.props.searchResult.page.month}/${this.props.searchResult.page.day}`}
                                icon="chevron right"
                                size="mini"                           >
                            </Button>
                        </div>
                        <h3>{this.props.searchResult.quoteText}</h3>
                        <h5>{this.props.searchResult.quoteAuthor}</h5>
                        <p>{this.state.thoughtString}</p>
                        <div
                            className="goToPage"
                        >

                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
    }
}


export default SearchResultCard