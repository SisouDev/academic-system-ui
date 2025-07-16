import { useQuery } from '@tanstack/react-query';
import { getMyAnnouncements } from '../../../services/student/studentApi';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export const AnnouncementsTab = () => {
    const { data: announcements, isLoading, isError, error } = useQuery({
        queryKey: ['myAnnouncements'],
        queryFn: getMyAnnouncements,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar avisos: {(error as Error).message}</Alert>;

    return (
        <div>
            {announcements && announcements.length > 0 ? (
                <ListGroup variant="flush">
                    {announcements.map(ann => (
                        <ListGroup.Item action as={Link} to={`/announcements/${ann.id}`} key={ann.id} className="d-flex align-items-center p-3">
                            <Megaphone className="me-3 text-warning flex-shrink-0" size={20} />
                            <div className="flex-grow-1">
                                <strong className="d-block">{ann.title}</strong>
                                <div className="text-muted small">
                                    <span>{ann.createdByFullName}</span>
                                    <span className="mx-2">&bull;</span>
                                    <span>{format(new Date(ann.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="secondary" className="text-center">Nenhum aviso para você no momento.</Alert>
            )}
        </div>
    );
};