import { useQuery } from '@tanstack/react-query';
import { getMyRecentLessons } from '../../../services/student/studentApi';
import { Alert, Spinner, ListGroup } from 'react-bootstrap';
import { BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RecentLessonsTab = () => {
    const { data: lessons, isLoading, isError, error } = useQuery({
        queryKey: ['myRecentLessons'],
        queryFn: getMyRecentLessons,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar as aulas: {(error as Error).message}</Alert>;

    return (
        <div>
            {lessons && lessons.length > 0 ? (
                <ListGroup variant="flush">
                    {lessons.map(lesson => (
                        <ListGroup.Item key={lesson.id} className="d-flex align-items-center p-3">
                            <BookOpen className="me-3 text-primary flex-shrink-0" size={20} />
                            <div className="flex-grow-1">
                                <strong className="d-block">{lesson.topic}</strong>
                                <div className="text-muted small">
                                    <span>{lesson.subjectName}</span>
                                    <span className="mx-2">&bull;</span>
                                    <span>{format(new Date(lesson.lessonDate), "dd 'de' MMMM", { locale: ptBR })}</span>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="secondary" className="text-center">Nenhuma aula recente encontrada.</Alert>
            )}
        </div>
    );
};