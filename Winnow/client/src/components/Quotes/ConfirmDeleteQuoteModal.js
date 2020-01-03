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
                        <ModalHeader toggle={this.toggle}>confirm delete</ModalHeader>
                        <ModalBody>
                            <div className="confirm__message">
                                <h4>are you sure you want to delete this quote?</h4>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                negative
                                onClick={()=>{
                                    this.props.removeQuote(this.props.pageQuote.quote.id, this.props.pageId)
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