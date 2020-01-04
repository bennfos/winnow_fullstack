import React, { Component } from 'react'
import QuoteList from '../Quotes/QuoteList'
import ThoughtList from '../Thoughts/ThoughtList'
import '../Styles/Pages.css'


class PageDay extends Component {
    state = {
        quotes: [],
        pages: [],
        thought: "",
      };


    render() {
        return (
            <React.Fragment>
                <div className="quoteList__container">
                    <QuoteList
                        {...this.props}
                    />
                    <ThoughtList
                        {...this.props}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default PageDay