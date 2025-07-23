import { useState } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { MoreVertical, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type {PurchaseRequest} from "../../types";
import {RequestReviewModal} from "./RequestReviewModal.tsx";


type ActionType = 'APPROVE' | 'REJECT';

const getStatusVariant = (status: PurchaseRequest['status']): string => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'APPROVED_BY_ASSISTANT': return 'info';
        case 'PROCESSED': return 'success';
        case 'REJECTED_BY_ASSISTANT': return 'danger';
        default: return 'secondary';
    }
};

interface PurchaseRequestTableRowProps {
    request: PurchaseRequest;
    onUpdateStatus: (variables: { id: number; newStatus: string; }) => void;
    isUpdating: boolean;
}

export const PurchaseRequestTableRow = ({ request, onUpdateStatus, isUpdating }: PurchaseRequestTableRowProps) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);

    const handleActionClick = (selectedAction: ActionType) => {
        setAction(selectedAction);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (action) {
            const statusMap = { 'APPROVE': 'APPROVED_BY_ASSISTANT', 'REJECT': 'REJECTED_BY_ASSISTANT' };
            onUpdateStatus({ id: request.id, newStatus: statusMap[action] });
        }
        setShowModal(false);
        setAction(null);
    };

    return (
        <>
            <tr>
                <td>#{request.id}</td>
                <td>
                    <div className="fw-bold">{request.itemName}</div>
                    <div className="small text-muted">Qtde: {request.quantity}</div>
                </td>
                <td>{request.requesterName}</td>
                <td>{format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                <td>
                    <Badge bg={getStatusVariant(request.status)} text={request.status === 'PENDING' ? 'dark' : 'white'}>
                        {request.status}
                    </Badge>
                </td>
                <td className="text-center align-middle">
                    {request.status === 'PENDING' && (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${request.id}`} bsPrefix="p-0" className="border-0 bg-transparent">
                                <MoreVertical size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => handleActionClick('APPROVE')}><Check size={16} className="me-2 text-success"/>Aprovar</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleActionClick('REJECT')}><X size={16} className="me-2 text-danger"/>Rejeitar</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </td>
            </tr>

            <RequestReviewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleConfirm}
                action={action!}
                requestInfo={{itemName: request.itemName, quantity: request.quantity}}
                isSubmitting={isUpdating}
            />
        </>
    );
};