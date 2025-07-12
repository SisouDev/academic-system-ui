// src/features/dashboard/components/widgets/TechnicianWidget.tsx
import { Col } from 'react-bootstrap';
import { HardDrive, ShieldAlert } from 'lucide-react';
import { QuickAccessCard } from '../common/QuickAccessCard';
import type { TechnicianSummary } from '../../../../types';

export const TechnicianWidget = ({ data }: { data: TechnicianSummary }) => {
    return (
        <>
            <Col md={6} className="mt-4">
                <QuickAccessCard
                    title="Chamados Abertos"
                    value={data.openSupportTickets}
                    icon={ShieldAlert}
                    to="/support/tickets"
                    variant="danger"
                />
            </Col>
            <Col md={6} className="mt-4">
                <QuickAccessCard
                    title="Ativos Atribuídos"
                    value={data.assignedAssetsCount}
                    icon={HardDrive}
                    to="/my-assets"
                    variant="secondary"
                />
            </Col>
        </>
    );
};