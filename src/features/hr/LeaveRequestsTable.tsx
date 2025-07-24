import { Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type {LeaveRequestDetails} from "../../types";

interface LeaveRequestsTableProps {
    requests: LeaveRequestDetails[];
}

const getStatusVariant = (status: LeaveRequestDetails['status']) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'APPROVED': return 'success';
        case 'REJECTED': return 'danger';
        default: return 'secondary';
    }
};

const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
        },
    }),
};

export const LeaveRequestsTable = ({ requests }: LeaveRequestsTableProps) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
                <th>Solicitante</th>
                <th>Tipo</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {requests.map((req, index) => (
                <motion.tr
                    key={req.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={tableRowVariants}
                >
                    <td>{req.id}</td>
                    <td>{req.requester.fullName}</td>
                    <td>{req.type}</td>
                    <td>{formatDate(req.startDate)}</td>
                    <td>{formatDate(req.endDate)}</td>
                    <td>
                        <Badge pill bg={getStatusVariant(req.status)}>
                            {req.status}
                        </Badge>
                    </td>
                </motion.tr>
            ))}
            </tbody>
        </Table>
    );
};