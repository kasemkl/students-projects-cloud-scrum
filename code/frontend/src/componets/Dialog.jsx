import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
 const Dialog=(props)=> {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {props.text}
        </p>
      </Modal.Body>
      {props.text!=='please wait a second...' && 
      <Modal.Footer>
        <Button onClick={props.onHide}>OK</Button>
      </Modal.Footer>}
    </Modal>
  );
}

export default Dialog;