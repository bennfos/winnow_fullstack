import React, { Component } from 'react'
import { Sidebar, Menu } from 'semantic-ui-react'
//import './PageMain.css'
import PageManager from '../../API/PageManager'
import PageViews from './PageViews'
//import QuoteDataManager from '../Quotes/QuoteDataManager'
//import MonthSelect from '../MonthSelect/MonthSelect'
import BookDataManager from '../../API/BookManager'



class PageMain extends Component {

    state = {
        visible: false,       
        modal: false,
        day: "",
        month: "",
        pageId: 0,
        pages: [],
        quotes: [],
        thought: "",
        monthOptions: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
        loadingStatus: false
    }

    toggleSidebar = () => {
        if (this.state.visible === false) {
          this.setState({ visible: true })
        } else {
          this.setState({ visible: false })
        }
      }

    toggle = () => {
        if (this.state.modal === false) {
          this.setState({ modal: true })
        } else {
          this.setState({ modal: false })
        }
      }

      //set month in state when selected in month menu
    setMonth = (month) => {
        this.setState({
            month: month
        })
    }

    //set day in state when day input button is selected in the month menu
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);       
    };

//Construct or navigate to page (called in Month components)
    constructOrNavigateToNewPage = () => {
    //Validates user input
        if (this.state.day === "") {
            alert("please select a day");
        } else {
            this.setState({ loadingStatus: true });

        //check to see if the page already exists in the database
            PageManager.checkPages(this.props.bookId, this.state.month, this.state.day)
                .then(pages => {

                //THEN, if it does exist, set state with that page's info, and push user to that page's view
                    if (pages.length > 0) {
                        console.log("navigated to", pages[0].month, pages[0].day)
                        this.setState({
                            pages: pages,
                            month: pages[0].month,
                            day: pages[0].day,
                            pageId: pages[0].id,
                            thought: pages[0].thought
                        })
                        this.props.history.push(`/books/${this.props.bookId}/${this.state.pageId}/${this.state.month}/${this.state.day}`)
                        this.toggle()
                        this.toggleSidebar()
                    } else {

                    //else, if the page does not exist yet, construct an object for that page
                        const newPage = {
                            userId: parseInt(sessionStorage.getItem("credentials")),
                            bookId: this.props.bookId,
                            month: this.state.month,
                            day: this.state.day,
                            thought: ""
                        };
                        console.log("created page for", newPage.month, newPage.day)
                        //post the page object to the database, THEN set state with that page's id, and push user to that page's view
                        PageManager.postPage(newPage)
                            .then(page => {
                                console.log("posted new page", page.id)
                                this.setState({
                                    pageId: page.id
                                })
                            })
                            .then(() => {
                                //then get a random quote
                                if (this.state.isBlank === false) {
                                    QuoteDataManager.getRandomQuote()

                                //then post quote for that page
                                    .then(quote => {
                                        console.log("got random quote:", quote.quoteText)
                                        const initialQuote = {
                                            userId: parseInt(sessionStorage.getItem("credentials")),
                                            bookId: this.props.bookId,
                                            quoteText: quote.quoteText,
                                            quoteAuthor: quote.quoteAuthor,
                                            timestamp: new Date().toLocaleString()
                                        };
                                        QuoteDataManager.postQuote(initialQuote)
                                            .then(quote => {
                                            console.log("random quote posted:", quote.quoteText)
                                        //construct a new pageQuote object
                                            const newPageQuote = {
                                                quoteId: quote.id,
                                                pageId: this.state.pageId,
                                                bookId: this.props.bookId
                                            }
                                        //post the new pageQuote to the database
                                            QuoteDataManager.savePageQuote(newPageQuote)
                                                .then(()=> {
                                                    console.log("pushing...")
                                                    this.props.history.push(`/books/${this.props.bookId}/${this.state.pageId}/${this.state.month}/${this.state.day}`)
                                                    this.toggle()
                                                    this.toggleSidebar()
                                                })
                                            })
                                    })

                            } else {
                                console.log("pushing...")
                                this.props.history.push(`/books/${this.props.bookId}/${this.state.pageId}/${this.state.month}/${this.state.day}`)
                                this.toggle()
                                this.toggleSidebar()
                            }
                        })

                    }
            })
        }
    }

//update state with appropriate quotes whenever page is changed (called in componentDidUpdate in QuoteList)
    renderPageQuotes = (pageId) => {
    //get quotes for the page that is passed in as an argument, and set them in state
        QuoteDataManager.getPageQuotes(pageId)
          .then(pageQuotes => {
            this.setState({
                pageQuotes: pageQuotes,
            })
          })
    }

//update state with appropriate thought whenever page is changed (called in componentDidUpdate ThoughtList)
    renderThought = (pageId) => {
    //get page data for page that is passed in as argument, and set thought in state
        PageManager.getPage(pageId)
            .then(page => {
                this.setState({
                    thought: page.thought
                })
            })
    }

    //Add quote and pageQuote to database (called in AddQuoteModal)
    addQuote = (quoteObject, pageId) => {
        //post new quote object to the database
        return QuoteDataManager.postQuote(quoteObject)
            .then(quote => {
                console.log("quote posted:", quote.quoteText)
              //construct a new pageQuote object
              const newPageQuote = {
                quoteId: quote.id,
                pageId: parseInt(pageId),
                bookId: this.props.bookId
              }
              //post the new pageQuote to the database
              QuoteDataManager.savePageQuote(newPageQuote)
                .then(() => {
                    console.log("new pageQuote created and posted")
                  QuoteDataManager.getPageQuotes(pageId)
                    .then(pageQuotes => {
                      this.setState({
                          pageQuotes: pageQuotes
                      })

              });
            });
          });
        };


//put edited quote object in database, then get all page quotes for that page and set them in state (called in EditQuoteModal)
    putEditedQuote = (quoteObject, pageId) => {
        return QuoteDataManager.editQuote(quoteObject)
            .then(() => {
                QuoteDataManager.getPageQuotes(pageId)
                .then(pageQuotes => {
                    this.setState({
                        pageQuotes: pageQuotes,
                    })
                })
            })
    }

//put page object with edited thought in database, then get the page and set thought in state (called in AddThoughtModal)
    putThought = (pageObject, pageId) => {
        PageManager.editPage(pageObject)
            .then(()=> {
                PageManager.getPage(pageId)
                .then(page => {
                    this.setState({
                        thought: page.thought
                })
                })
            })
    }


//delete quote from database, then get all pageQuotes and set them in state (called in QuoteCard)
    removeQuote = (id, pageId) => {
        QuoteDataManager.deleteQuote(id)
            .then(() => {
                QuoteDataManager.getPageQuotes(pageId)
                    .then(pageQuotes => {
                        this.setState({
                            pageQuotes: pageQuotes,
                        })

                    })
            })
    };


    componentDidMount () {
        BookDataManager.getBook(this.props.bookId)
            .then(book => {
                this.setState({
                    isBlank: book.isBlank
                })
            })
    }


    render() {
        const { visible } = this.state
        return (
        <>
            <div className="pageSelect">
                <Menu
                    fluid widths={1}
                    borderless
                    fixed="top"
                    inverted
                    color="grey"
                    >
                        <Menu.Item

                            onClick={this.toggleSidebar}
                            icon="chevron down"
                        >
                        </Menu.Item>
                </Menu>
            <div className="spacer"></div>
            <Sidebar.Pushable animation='push'>
                <div className="sidebar">
                <Sidebar
                    as={Menu}
                    color="grey"
                    animation='push'
                    icon='labeled'
                    inverted
                    horizontal="true"
                    direction='top'
                    visible={visible}
                    className="sidebar__menu"
                >
                {this.state.monthOptions.map(monthSelect => (
                    <MonthSelect
                        key={monthSelect}
                        setMonth={this.setMonth}
                        toggleSidebar={this.toggleSidebar}
                        toggle={this.toggle}
                        handleFieldChange={this.handleFieldChange}
                        constructOrNavigateToNewPage={this.constructOrNavigateToNewPage}
                        monthSelect={monthSelect}
                        {...this.props}
                    />
                ))}

            </Sidebar>

            </div>
            <Sidebar.Pusher className="sidebar__pusher" dimmed={this.state.visible}>
                <PageViews
                putEditedQuote={this.putEditedQuote}
                addQuote={this.addQuote}
                removeQuote={this.removeQuote}
                renderPageQuotes={this.renderPageQuotes}
                putThought={this.putThought}
                thought={this.state.thought}
                pageQuotes={this.state.pageQuotes}
                renderThought={this.renderThought}
                {...this.props}
                />
            </Sidebar.Pusher>
            </Sidebar.Pushable>

            </div>
        </>
        )
    }
}


export default PageMain