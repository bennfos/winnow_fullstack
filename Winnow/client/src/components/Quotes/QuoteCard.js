import React, { Component } from 'react'
import QuoteManager from '../../API/QuoteManager'
import EditQuoteModal from '../Quotes/EditQuoteModal'
import ConfirmDeleteQuoteModal from './ConfirmDeleteQuoteModal';
import { Transition } from 'semantic-ui-react'
//import '../Books/Card.css'
//import './Quotes.css'


class QuoteCard extends Component {
    state = {
        randomQuoteText: "",
        display: "hide",
        visible: false
    }

    toggle = () => {
        this.setState(state => ({ visible: !state.visible }))
        console.log(this.state.visible);
      }


//get random quote from Forismatic API and set it in state (not used yet--stretch goal)
  getRandom = () => {
      QuoteManager.getRandomQuote()
        .then(quoteObj => {
            this.setState({
                randomQuoteText: quoteObj.quoteText,
                randomQuoteAuthor: quoteObj.quoteAuthor
            })
        })
  }

  toggleEditAndDelete = () => {
      if (this.state.display === "hide") {
        this.setState({
            display: "show"
        })
    } else if (this.state.display === "show") {
        this.setState({
            display: "hide"
        })
    }
}

  render() {
    return (
        <>
            <div
                className="card__container"
                onClick={this.toggle}>

                    <div
                        className="quoteCard__content"
                    >
                        <h3>{this.props.pageQuote.quote.quoteText}</h3>
                        <h5>{this.props.pageQuote.quote.quoteAuthor}</h5>
                    </div>
                    <Transition animation="horizontal flip" visible={this.state.visible}>

                        <div className="editAndDelete">
                            <ConfirmDeleteQuoteModal
                                {...this.props}
                            />
                            <EditQuoteModal
                                {...this.props}/>
                        </div>

                    </Transition>
            </div>
        </>
    );
    }
}


export default QuoteCard