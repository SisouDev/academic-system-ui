import { Modal, Button } from 'react-bootstrap';

interface ReviewPurchaseOrderModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    action: 'APPROVE' | 'REJECT' | 'PAY';
    orderDescription: string;
    isSubmitting: boolean;
}

const actionConfig = {
    APPROVE: { title: 'Aprovar Ordem de Compra', body: 'Você tem certeza que deseja APROVAR esta ordem de compra?', variant: 'success', confirmText: 'Sim, Aprovar' },
    REJECT: { title: 'Rejeitar Ordem de Compra', body: 'Você tem certeza que deseja REJEITAR esta ordem de compra?', variant: 'danger', confirmText: 'Sim, Rejeitar' },
    PAY: { title: 'Marcar como Paga', body: 'Você confirma o PAGAMENTO desta ordem de compra?', variant: 'primary', confirmText: 'Sim, Marcar como Paga' },
};

export const ReviewPurchaseOrderModal = ({ show, onHide, onConfirm, action, orderDescription, isSubmitting }: ReviewPurchaseOrderModalProps) => {
    if (!action) return null;
    const config = actionConfig[action];

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title as="h5">{config.title}</Modal.Title></Modal.Header>
            <Modal.Body>
                <p>{config.body}</p>
                <p className="text-muted border-start border-3 border-secondary ps-2 mb-0"><strong>Item:</strong> {orderDescription}</p>
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