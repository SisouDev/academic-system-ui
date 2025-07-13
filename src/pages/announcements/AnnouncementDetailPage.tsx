import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import api from '../../services/auth/api';
import { ArrowLeft, User, Clock } from 'lucide-react';
import type { AnnouncementDetails } from '../../types';

const getAnnouncementDetails = async (announcementId?: string): Promise<AnnouncementDetails> => {
    if (!announcementId) throw new Error("ID do aviso não fornecido.");
    const { data } = await api.get(`/api/v1/announcements/${announcementId}`);
    return data;
};

const SafeHtmlRenderer = ({ html }: { html: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function AnnouncementDetailPage() {
    const { id: announcementId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: announcement, isLoading, isError, error } = useQuery({
        queryKey: ['announcementDetails', announcementId],
        queryFn: () => getAnnouncementDetails(announcementId),
        enabled: !!announcementId,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar o aviso: {(error as Error).message}</Alert>;

    return (
        <div>
            <Button variant="light" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft size={18} className="me-2" />
                Voltar
            </Button>

            <Card className="shadow-sm">
                <Card.Header>
                    <h1 className="h3" style={{ fontFamily: 'Raleway, sans-serif' }}>{announcement?.title}</h1>
                    <div className="d-flex align-items-center text-muted small gap-3">
                        <span className="d-flex align-items-center">
                            <User size={14} className="me-1" />
                            {announcement?.createdBy.fullName}
                        </span>
                        <span className="d-flex align-items-center">
                            <Clock size={14} className="me-1" />
                            {new Date(announcement?.createdAt || '').toLocaleString('pt-BR')}
                        </span>
                    </div>
                </Card.Header>
                <Card.Body>
                    <SafeHtmlRenderer html={announcement?.content || ''} />
                </Card.Body>
            </Card>
        </div>
    );
}