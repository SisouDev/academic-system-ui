import { Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { InternalRequestDetails } from '../../../types';

interface PendingRequestsTableProps {
    requests: InternalRequestDetails[];
}

const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
        case 'CRITICAL': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'primary';
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

export const PendingRequestsTable = ({ requests }: PendingRequestsTableProps) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Solicitante</th>
                <th>Departamento Alvo</th>
                <th>Urgência</th>
                <th>Data</th>
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
                    <td>{req.title}</td>
                    <td>{req.requester.fullName}</td>
                    <td>{req.targetDepartment?.name ?? 'N/A'}</td>
                    <td>
                        <Badge pill bg={getUrgencyVariant(req.urgency)}>
                            {req.urgency}
                        </Badge>
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString('pt-BR')}</td>
                </motion.tr>
            ))}
            </tbody>
        </Table>
    );
};