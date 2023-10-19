import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

const WelcomeModal = ({ handleClose, show }) => {
  return (
    <React.Fragment>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="welcome_title">
            Brain-Boosting Bonanza: Dive into Our New Quiz Feature!
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleClose}>
            <Link to="/quizzes">Go to Quiz!</Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default WelcomeModal;
