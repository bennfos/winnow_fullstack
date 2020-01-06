import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import { Button } from 'semantic-ui-react'
//import '../Books/Card.css'

class SearchResultCard extends Component {


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