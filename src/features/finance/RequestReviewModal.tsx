import { Modal, Button } from 'react-bootstrap';

interface RequestReviewModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    action: 'APPROVE' | 'REJECT';
    requestInfo: { itemName: string; quantity: number; };
    isSubmitting: boolean;
}

const actionConfig = {
    APPROVE: { title: 'Aprovar Requisição', body: 'Ao aprovar, uma Ordem de Compra formal será criada para análise do gerente. Confirma?', variant: 'success', confirmText: 'Sim, Aprovar' },
    REJECT: { title: 'Rejeitar Requisição', body: 'Você tem certeza que deseja rejeitar esta requisição?', variant: 'danger', confirmText: 'Sim, Rejeitar' },
};

export const RequestReviewModal = ({ show, onHide, onConfirm, action, requestInfo, isSubmitting }: RequestReviewModalProps) => {
    if (!action) return null;
    const config = actionConfig[action];

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title as="h5">{config.title}</Modal.Title></Modal.Header>
            <Modal.Body>
                <p>{config.body}</p>
                <p className="text-muted border-start border-3 border-secondary ps-2 mb-0">
                    <strong>Item:</strong> {requestInfo.itemName} (Qtde: {requestInfo.quantity})
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