import { Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type {TransactionDetail, TransactionStatus} from "../../types";


interface ProblematicTransactionsTableProps {
    transactions: TransactionDetail[];
}

const getStatusVariant = (status: TransactionStatus) => {
    switch (status) {
        case 'FAILED':
            return 'danger';
        case 'PENDING':
            return 'warning';
        case 'IN_DISPUTE':
            return 'info';
        default:
            return 'secondary';
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

export const ProblematicTransactionsTable = ({ transactions }: ProblematicTransactionsTableProps) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th className="text-end">Valor</th>
                <th>Status</th>
                <th>Data</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx, index) => (
                <motion.tr
                    key={tx.transactionId}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={tableRowVariants}
                >
                    <td>{tx.transactionId}</td>
                    <td>
                        <div>{tx.personName}</div>
                        <small className="text-muted">{tx.personEmail}</small>
                    </td>
                    <td>{tx.description}</td>
                    <td className="text-end">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                    </td>
                    <td>
                        <Badge pill bg={getStatusVariant(tx.status)}>
                            {tx.status}
                        </Badge>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</td>
                </motion.tr>
            ))}
            </tbody>
        </Table>
    );
};