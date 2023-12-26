import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
 const ConfirmDialog=(props)=> {
  const {onConfirm,...others}=props
    return (
    <Modal
      {...others}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        Are you sure you want to delete?
                </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={props.onConfirm}>Yes</Button>
        <Button variant='secondary' onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialog;