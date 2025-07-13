import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    title: string;
    body: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isConfirming?: boolean;
}

export const ConfirmationModal = ({
                                      show,
                                      onHide,
                                      onConfirm,
                                      title,
                                      body,
                                      confirmButtonText = "Confirmar",
                                      cancelButtonText = "Cancelar",
                                      isConfirming = false
                                  }: ConfirmationModalProps) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isConfirming}>
                    {cancelButtonText}
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
                    {isConfirming ? 'Apagando...' : confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};