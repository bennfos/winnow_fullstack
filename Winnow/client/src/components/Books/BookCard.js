import React, { Component } from 'react'
import EditBookModal from './EditBookModal.js'
import { Button, Transition } from 'semantic-ui-react'
 import PageManager from '../../API/PageManager'
 import QuoteManager from '../../API/QuoteManager'
import ConfirmBookDeleteModal from './ConfirmDeleteBookModal'
// import './Card.css'

class BookCard extends Component {
    state = {
        page: {},       
        pageId: 0,
        description: "",
        display: "hide",
        visible: false,
        loadingStatus: false
    }

   
    navigateToPage = (page) => {
        this.setState({
            page: page,           
            pageId: page.id,           
        })
        console.log(this.state.pageId)
        this.props.history.push(`/books/${this.props.book.id}/${this.state.pageId}/${this.props.currentMonth}/${this.props.currentDate}`)
        
    }

    constructNewPage = () => {
        const newPage = {      
            bookId: this.props.book.id,             
            month: this.props.currentMonth,
            day: this.props.currentDate,
            thought: ""
        };
        console.log("created page for", newPage.month, newPage.day) 
        //post the page object to the database, THEN set state with that page's id, and push user to that page's view
        PageManager.postPage(newPage)
        .then(newPage => {
            console.log("posted new page", newPage.id, newPage.month, newPage.day)
            this.setState({
                pageId: newPage.id
            })
        })
        .then(() => {
        //     //then get a random quote
        //     if (this.props.startsBlank === false) {
        //         QuoteManager.getRandomQuote()

        //     //then post quote for that page
        //         .then(quote => {
        //             console.log("got random quote:", quote.quoteText)
        //             const initialQuote = {                     
        //                 pageId: this.state.pageId,
        //                 quoteText: quote.quoteText,
        //                 quoteAuthor: quote.quoteAuthor,                       
        //             };
        //             QuoteManager.postQuote(initialQuote)
        //                 .then(quote => {
        //                 console.log("random quote posted:", quote.quoteText)
        //                 this.props.history.push(`/books/${this.props.book.id}/${this.state.pageId}/${this.props.currentMonth}/${this.props.currentDate}`)                                        
        //                 })                   
        //         })
        //     } else {
            console.log("pushing...")
            this.props.history.push(`/books/${this.props.book.id}/${this.state.pageId}/${this.props.currentMonth}/${this.props.currentDate}`)
            // }
        })
    }

    handleOpenBook = () => {
        if (this.state.day === "") { 
            alert("please select a day");
        } else {
            this.setState({ loadingStatus: true });

        //check to see if the page already exists in the database
            PageManager.checkForPage(this.props.book.id, this.props.currentMonth, this.props.currentDate)
                .then(page => {
                    console.log("page response: ", page)
                    //THEN, if it does exist, set state with that page's info, and push user to that page's view
                    if (page.id !== 0) {
                        this.navigateToPage(page)                                  
                        console.log("navigated to", page.month, page.day)
                    } else {                      
                    //else, if the page does not exist yet, construct an object for that page
                        this.constructNewPage()                       
                                             
                    }
                })
        }
   }


    toggle = () => {
        this.setState(state => ({ visible: !state.visible }))
        console.log(this.state.visible);
      }

  render() {
    return (

        <div className="bookCard">
        <button onClick={this.toggle}>edit or delete</button>
                 <Transition animation="horizontal flip" visible={this.state.visible}>
                    <div className="bookEditAndDelete">
                        <ConfirmBookDeleteModal {...this.props}/> 
                        <EditBookModal
                            {...this.props}
                            putEditedBook={this.props.putEditedBook}
                        />
                    </div>
                </Transition>
                        <div className="card__title"
                        >
                            <h2>{this.props.book.title}</h2>
                            <div>
                                <Button
                                    onClick={this.handleOpenBook}
                                    icon="chevron right"
                                    size="mini"
                                >
                                </Button>
                            </div>
                        </div>

                    <div className="book__description">
                        <h4><em>{this.props.book.description}</em></h4>
                    </div>
            </div>

    );
  }
}

export default BookCard
