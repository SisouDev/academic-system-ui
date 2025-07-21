import { Modal, Button } from 'react-bootstrap';

interface ReviewLoanModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    action: 'APPROVE' | 'REJECT' | 'RETURN';
    itemTitle: string;
    isSubmitting: boolean;
}

const actionConfig = {
    APPROVE: { title: 'Aprovar Empréstimo', body: 'Você tem certeza que deseja APROVAR este empréstimo?', variant: 'success', confirmText: 'Sim, Aprovar' },
    REJECT: { title: 'Recusar Empréstimo', body: 'Você tem certeza que deseja RECUSAR este empréstimo?', variant: 'danger', confirmText: 'Sim, Recusar' },
    RETURN: { title: 'Registrar Devolução', body: 'Você confirma a devolução deste item?', variant: 'primary', confirmText: 'Sim, Registrar' },
};

export const ReviewLoanModal = ({ show, onHide, onConfirm, action, itemTitle, isSubmitting }: ReviewLoanModalProps) => {
    const config = actionConfig[action];

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title as="h5">{config.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{config.body}</p>
                <p className="text-muted border-start border-3 border-secondary ps-2 mb-0">
                    <strong>Item:</strong> {itemTitle}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide} disabled={isSubmitting}>Cancelar</Button>
                <Button variant={config.variant} onClick={onConfirm} disabled={isSubmitting}>
                    {isSubmitting ? 'Processando...' : config.confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};