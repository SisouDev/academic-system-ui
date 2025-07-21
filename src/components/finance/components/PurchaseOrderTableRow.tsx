import { useState } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { MoreVertical, Check, X, CircleDollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PurchaseOrderDetails } from '../../../types';
import { ReviewPurchaseOrderModal } from './ReviewPurchaseOrderModal';

type ActionType = 'APPROVE' | 'REJECT' | 'PAY';

const getStatusVariant = (status: PurchaseOrderDetails['status']): string => {
    switch (status) {
        case 'PENDING_APPROVAL': return 'warning';
        case 'APPROVED': return 'info';
        case 'PAID': return 'success';
        case 'REJECTED':
        case 'CANCELLED': return 'danger';
        default: return 'secondary';
    }
};

interface PurchaseOrderTableRowProps {
    order: PurchaseOrderDetails;
    onUpdateStatus: (variables: { id: number; status: string; }) => void;
    isUpdating: boolean;
}

export const PurchaseOrderTableRow = ({ order, onUpdateStatus, isUpdating }: PurchaseOrderTableRowProps) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);

    const handleActionClick = (selectedAction: ActionType) => {
        setAction(selectedAction);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (action) {
            const statusMap = { 'APPROVE': 'APPROVED', 'REJECT': 'REJECTED', 'PAY': 'PAID' };
            onUpdateStatus({ id: order.id, status: statusMap[action] });
        }
        setShowModal(false);
        setAction(null);
    };

    return (
        <>
            <tr>
                <td>#{order.id}</td>
                <td>
                    <div className="fw-bold">{order.supplier}</div>
                    <div className="small text-muted">{order.description}</div>
                </td>
                <td>{order.requesterName}</td>
                <td className="text-end">{order.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{format(new Date(order.orderDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                <td><Badge bg={getStatusVariant(order.status)}>{order.status}</Badge></td>
                <td className="text-center align-middle">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${order.id}`} bsPrefix="p-0" className="border-0 bg-transparent">
                            <MoreVertical size={20} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            {order.status === 'PENDING_APPROVAL' && (
                                <>
                                    <Dropdown.Item onClick={() => handleActionClick('APPROVE')}><Check size={16} className="me-2 text-success"/>Aprovar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleActionClick('REJECT')}><X size={16} className="me-2 text-danger"/>Rejeitar</Dropdown.Item>
                                </>
                            )}
                            {order.status === 'APPROVED' && (
                                <Dropdown.Item onClick={() => handleActionClick('PAY')}><CircleDollarSign size={16} className="me-2 text-primary"/>Marcar como Paga</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>

            <ReviewPurchaseOrderModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleConfirm}
                action={action!}
                orderDescription={order.description}
                isSubmitting={isUpdating}
            />
        </>
    );
};