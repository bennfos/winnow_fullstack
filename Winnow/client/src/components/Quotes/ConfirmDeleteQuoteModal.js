import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Icon, Button} from 'semantic-ui-react'

class ConfirmDeleteQuoteModal extends Component {

//Defines initial state
    state = {

            modal: false
        };


//Displays/hides the new article modal
    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }


    render(){
        return(
            <>
                <section className="confirmSectionContent">
                    <Icon
                        className="delete__icon"
                        name="delete"
                        onClick={this.toggle}
                        size="large"
                    >
                    </Icon>
                </section>
                <div>
                    <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                    >
                        <ModalHeader toggle={this.toggle}>are you sure you want to delete this quote?</ModalHeader>
                        <ModalBody>
                            <div className="confirm__message">
                                <h4>{this.props.quote.quoteText}</h4>
                                <p>{this.props.quote.quoteAuthor}</p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                negative
                                onClick={()=>{
                                    this.props.removeQuote(this.props.quote.id, this.props.pageId)
                                    this.toggle()
                                }}>delete</Button>
                            <Button
                                onClick={this.toggle}
                            >cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </>
        )
    }
}

export default ConfirmDeleteQuoteModal