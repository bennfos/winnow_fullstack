import React, { Component } from 'react'
import { Card, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Input} from 'reactstrap'
import { Button } from 'semantic-ui-react'
import PageManager from '../../API/PageManager'
import ConfirmDeleteThoughtModal from './ConfirmDeleteThoughtModal'
//import '../Books/Card.css'
//import './Thoughts.css'

class ThoughtCard extends Component {
    state = {
        pages: [],
        pageId: 0,
        
        thought: "",
        modal: false,
        loadingStatus: false,
    }

//updates state of thought in PageMain to trigger render when ThoughtCard is mounted
    componentDidMount() {
        this.props.renderThought(this.props.pageId)
        PageManager.getPage(this.props.pageId)
            .then(page => {
                this.setState({
                    thought: page.thought,
                    loadingStatus: false,
                });
            });
        }

//toggles modal
toggle = () => {
    this.setState(prevState => ({
        modal: !prevState.modal
    }));
}


//Sets state with input values as fields change
handleFieldChange = evt => {
    const stateToChange = {};
    stateToChange[evt.target.id] = evt.target.value;
    this.setState(stateToChange);
};

constructOrEditThought = event => {
//Validates user input
    if (this.state.thought === "") {
        alert("please provide the thought text");
    } else {
        //construct a page object that includes the new or edited thought
            const pageWithThought = {
                id: this.props.pageId,
                userId: parseInt(sessionStorage.getItem("credentials")),
                bookId: this.props.bookId,
                month: this.props.month,
                day: this.props.day,
                thought: this.state.thought
            }
        //put the page object with new or edited thought in the database
            this.props.putThought(pageWithThought, this.props.pageId)
        }
    this.toggle()
}

//gets thought for that page into state so that it can be displayed in input field for user

//When component receives new pageId in props (i.e., page is changed) from PageMain, update state in PageMain to cause an update of state in this modal. Ensures correct value will populate in input field after page change.
componentDidUpdate(prevProps) {
    if (this.props.pageId !== prevProps.pageId) {
      this.props.renderThought(this.props.pageId)
      this.setState({
        thought: this.props.thought
      })
    }
  }

//clears state of thought so that nothing will display if there is no thought in props.
//This ensures input field will be empty if opening modal from page with no thought yet added.
//This fixes a bug which caused thought from previous page to input field when adding thought to a new page.
resetThoughtInStateIfNoThoughtInProps = () => {
    if (this.props.thought === "") {
        this.setState({
            thought: ""
        })
    }
}

  render() {
    return (

        <div>
            <Card
                body
                className="thoughtCard"
                onClick={()=> {
                    this.toggle()
                    this.resetThoughtInStateIfNoThoughtInProps()
                }}
            >
            <div>
                    <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                    >
                        <ModalHeader toggle={this.toggle}>thought</ModalHeader>
                        <ModalBody>
                            <Input onChange={this.handleFieldChange}
                                    type="textarea"
                                    id="thought"
                                    placeholder="add thought"
                                    required
                                    autoFocus=""
                                    value={this.state.thought}
                            ></Input>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                primary
                                onClick={ () => {
                                    this.constructOrEditThought()
                                }
                                }>save</Button>
                            <ConfirmDeleteThoughtModal
                                {...this.props}
                                toggle={this.toggle}
                            />
                            <Button
                                onClick={this.toggle}
                                >cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <div className="card__content">
                        <CardTitle
                            className="card__thought">
                            <h6><em>{this.props.thought}</em></h6>
                        </CardTitle>

                </div>
            </Card>
        </div>


    );
  }
}

export default ThoughtCard

