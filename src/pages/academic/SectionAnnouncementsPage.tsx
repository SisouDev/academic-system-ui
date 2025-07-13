import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Button, Modal, Card } from 'react-bootstrap';
import api from '../../services/auth/api';
import { useState } from 'react';
import { CreateAnnouncementForm } from '../../features/my-classes/components/CreateAnnouncementForm';
import { PlusCircle } from 'lucide-react';
import type { AnnouncementSummary } from '../../types';

const getSectionAnnouncements = async (sectionId?: string): Promise<AnnouncementSummary[]> => {
    if (!sectionId) return [];
    const { data } = await api.get(`/api/v1/announcements?courseSectionId=${sectionId}`);
    return data._embedded?.announcementSummaryDtoList || [];
};

export default function SectionAnnouncementsPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: announcements, isLoading, isError, error } = useQuery({
        queryKey: ['announcements', sectionId],
        queryFn: () => getSectionAnnouncements(sectionId),
        enabled: !!sectionId,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar avisos: {error.message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Avisos da Turma</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    <PlusCircle size={18} className="me-2" />
                    Novo Aviso
                </Button>
            </div>

            {announcements && announcements.length > 0 ? (
                announcements.map((announcement) => (
                    <Card key={announcement.id} className="mb-3 shadow-sm">
                        <Card.Header className="d-flex justify-content-between">
                            <strong>{announcement.title}</strong>
                            <small className="text-muted">
                                Publicado por {announcement.createdByFullName} em {new Date(announcement.createdAt).toLocaleDateString()}
                            </small>
                        </Card.Header>
                        <Card.Body>Ver detalhes...</Card.Body>
                    </Card>
                ))
            ) : (
                <Alert variant="info">Nenhum aviso publicado para esta turma.</Alert>
            )}

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Criar Novo Aviso para a Turma</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateAnnouncementForm sectionId={Number(sectionId)} onDone={() => setShowCreateModal(false)} />
                </Modal.Body>
            </Modal>
        </div>
    );
}