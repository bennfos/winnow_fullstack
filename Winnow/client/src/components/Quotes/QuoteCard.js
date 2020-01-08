import React, { Component } from 'react'
import QuoteManager from '../../API/QuoteManager'
import EditQuoteModal from '../Quotes/EditQuoteModal'
import ConfirmDeleteQuoteModal from './ConfirmDeleteQuoteModal';
import { Transition } from 'semantic-ui-react'
import { Fade } from 'reactstrap'
import '../Styles/Pages.css'



class QuoteCard extends Component {
    state = {
        randomQuoteText: "",
        display: "hide",
        visible: false,
        fadeIn: true
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

    componentWillUnmount () {
        this.setState({
        fadeIn: false
        })
    }

  render() {
    return (
        <>
            <Fade in={this.state.fadeIn} timeout={600}>
                <div className="quoteCard__container" onClick={this.toggle}>
                    <div className="quoteCard__contents">
                        <h3>{this.props.quote.quoteText}</h3>
                        <h5 className="author">{this.props.quote.quoteAuthor}</h5>
                    </div>
                    <Transition animation="horizontal flip" visible={this.state.visible}>
                        <div className="editAndDelete">
                            <div className="delete">
                                <ConfirmDeleteQuoteModal
                                    {...this.props}/>
                            </div>
                            <div className="edit">
                                <EditQuoteModal
                                    {...this.props}/>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Fade>
        </>
    );
    }
}


export default QuoteCard