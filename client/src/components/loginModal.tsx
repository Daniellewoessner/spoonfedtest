import Button from 'react-bootstrap/Button';
import Modal, { ModalProps as BSModalProps } from 'react-bootstrap/Modal';

interface LoginModalProps extends Omit<BSModalProps, 'onHide'> {
    onHide: () => void;
    show: boolean;
    size?: 'sm' | 'lg' | 'xl';
    centered?: boolean;
}

const LoginModal = (props: LoginModalProps) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Alert
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Login Successful!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LoginModal;