import { Col } from 'react-bootstrap';
import { QuickAccessCard } from '../common/QuickAccessCard';
import { Library, BookUp } from 'lucide-react';
import type { LibrarianSummary } from '../../../../types';

export const LibrarianWidget = ({ data }: { data: LibrarianSummary }) => (
    <>
        <Col md={6} className="mt-4">
            <QuickAccessCard
                title="Empréstimos Pendentes"
                value={data.pendingLoans}
                icon={Library}
                to="/library/loans"
                variant="warning"
            />
        </Col>
        <Col md={6} className="mt-4">
            <QuickAccessCard
                title="Livros Atrasados"
                value={data.overdueBooks}
                icon={BookUp}
                to="/library/loans/overdue"
                variant="danger"
            />
        </Col>
    </>
);