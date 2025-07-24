import { useQuery } from '@tanstack/react-query';
import { Modal, Button, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { getLoanById } from '../../../services/employee/libraryApi';
import type { LoanDetails } from '../../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LoanDetailsModalProps {
    loanId: number | null;
    show: boolean;
    onHide: () => void;
}

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

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <ListGroup.Item className="d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
            <div className="fw-bold">{label}</div>
            {value}
        </div>
    </ListGroup.Item>
);

export const LoanDetailsModal = ({ loanId, show, onHide }: LoanDetailsModalProps) => {
    const { data: loan, isLoading, isError, error } = useQuery({
        queryKey: ['loanDetails', loanId],
        queryFn: () => getLoanById(loanId!),
        enabled: !!loanId && show,
    });

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalhes do Empréstimo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <div className="text-center p-5"><Spinner /></div>}
                {isError && <Alert variant="danger">Erro ao carregar detalhes: {(error as Error).message}</Alert>}

                {loan && (
                    <ListGroup variant="flush">
                        <DetailRow label="Item da Biblioteca" value={
                            <>
                                {loan.item.title}
                                <div className="small text-muted">{loan.item.type}</div>
                            </>
                        } />
                        <DetailRow label="Usuário" value={
                            <>
                                {loan.borrower.fullName}
                                {loan.borrower.email && <div className="small text-muted">{loan.borrower.email}</div>}
                            </>
                        } />
                        <DetailRow label="Status" value={
                            <Badge
                                bg={getStatusVariant(loan.status).bg}
                                text={getStatusVariant(loan.status).text}
                            >
                                {loan.status}
                            </Badge>
                        } />
                        <DetailRow
                            label="Data do Empréstimo"
                            value={format(new Date(loan.loanDate), 'dd/MM/yyyy', { locale: ptBR })}
                        />
                        <DetailRow
                            label="Data de Vencimento"
                            value={format(new Date(loan.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        />
                        {loan.returnDate && (
                            <DetailRow
                                label="Data de Devolução"
                                value={format(new Date(loan.returnDate), 'dd/MM/yyyy', { locale: ptBR })}
                            />
                        )}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};