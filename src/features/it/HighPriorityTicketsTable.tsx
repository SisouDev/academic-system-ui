import { Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type {SupportTicketDetails} from "../../types";

interface HighPriorityTicketsTableProps {
    tickets: SupportTicketDetails[];
}

const getPriorityVariant = (priority: SupportTicketDetails['priority']) => {
    switch (priority) {
        case 'URGENT': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'info';
        case 'LOW': return 'secondary';
        default: return 'primary';
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

export const HighPriorityTicketsTable = ({ tickets }: HighPriorityTicketsTableProps) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Solicitante</th>
                <th>Prioridade</th>
                <th>Data</th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket, index) => (
                <motion.tr
                    key={ticket.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={tableRowVariants}
                >
                    <td>{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.requester.fullName}</td>
                    <td>
                        <Badge pill bg={getPriorityVariant(ticket.priority)}>
                            {ticket.priority}
                        </Badge>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                </motion.tr>
            ))}
            </tbody>
        </Table>
    );
};