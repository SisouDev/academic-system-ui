import { useState } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import { MoreVertical, Check, X, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LoanDetails } from '../../../types';
import { ReviewLoanModal } from './ReviewLoanModal';
import {LoanDetailsModal} from "./LoanDetailsModal.tsx";

type ActionType = 'APPROVE' | 'REJECT' | 'RETURN';

const getStatusVariant = (status: LoanDetails['status']) => {
    switch (status) {
        case 'PENDING':
            return { bg: 'warning', text: 'dark' };
        case 'ACTIVE':
            return { bg: 'primary', text: 'white' };
        case 'OVERDUE':
            return { bg: 'danger', text: 'white' };
        case 'RETURNED':
            return { bg: 'success', text: 'white' };
        case 'REJECTED':
            return { bg: 'secondary', text: 'white' };
        default:
            return { bg: 'light', text: 'dark' };
    }
};

interface LoanTableRowProps {
    loan: LoanDetails;
    onUpdateStatus: (variables: { id: number; status: string; }) => void;
    isUpdating: boolean;
}

export const LoanTableRow = ({ loan, onUpdateStatus, isUpdating }: LoanTableRowProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);

    const handleActionClick = (selectedAction: ActionType) => {
        setAction(selectedAction);
        setShowModal(true);
        setShowDetailsModal(true);
    };

    const handleConfirm = () => {
        if (action) {
            const statusMap = { 'APPROVE': 'ACTIVE', 'REJECT': 'REJECTED', 'RETURN': 'RETURNED' };
            onUpdateStatus({ id: loan.id, status: statusMap[action] });
        }
        setShowModal(false);
        setAction(null);
    };

    return (
        <>
            <tr>
                <td>
                    <div className="fw-bold">{loan.item.title}</div>
                    <div className="small text-muted">{loan.item.type}</div>
                </td>
                <td>{loan.borrower.fullName}</td>
                <td>{format(new Date(loan.loanDate), 'dd/MM/yy', { locale: ptBR })}</td>
                <td>{format(new Date(loan.dueDate), 'dd/MM/yy', { locale: ptBR })}</td>
                <td>
                    <Badge bg={getStatusVariant(loan.status).bg} text={getStatusVariant(loan.status).text}>
                        {loan.status}
                    </Badge>
                </td>
                <td className="text-center align-middle">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" id={`dropdown-loan-${loan.id}`} bsPrefix="p-0" className="border-0 bg-transparent">
                            <MoreVertical size={20} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => setShowDetailsModal(true)}>Ver Detalhes do Empréstimo</Dropdown.Item>
                            <Dropdown.Divider />
                            {loan.status === 'PENDING' && (
                                <>
                                    <Dropdown.Item onClick={() => handleActionClick('APPROVE')}><Check size={16} className="me-2 text-success"/>Aprovar</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleActionClick('REJECT')}><X size={16} className="me-2 text-danger"/>Recusar</Dropdown.Item>
                                </>
                            )}
                            {(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
                                <Dropdown.Item onClick={() => handleActionClick('RETURN')}><Undo2 size={16} className="me-2 text-primary"/>Registrar Devolução</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>

            {action && (
                <ReviewLoanModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    onConfirm={handleConfirm}
                    action={action}
                    itemTitle={loan.item.title}
                    isSubmitting={isUpdating}
                />
            )}
            <LoanDetailsModal
                loanId={loan.id}
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
            />
        </>

    );
};