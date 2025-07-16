import { useQuery } from '@tanstack/react-query';
import { getMyTeacherNotes } from '../../../services/student/studentApi';
import { Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { MessageSquareQuote } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TeacherNotesTab = () => {
    const { data: notes, isLoading, isError, error } = useQuery({
        queryKey: ['myTeacherNotes'],
        queryFn: getMyTeacherNotes,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar anotações: {(error as Error).message}</Alert>;

    return (
        <div className="d-flex flex-column gap-3">
            {notes && notes.length > 0 ? (
                notes.map(note => (
                    <Card key={note.id} className="shadow-sm">
                        <Card.Body>
                            <blockquote className="blockquote mb-0">
                                <p style={{whiteSpace: 'pre-wrap'}}>{note.content}</p>
                                <footer className="blockquote-footer d-flex justify-content-between align-items-center mt-2">
                                    <div>
                                        {note.authorName} em <cite title="Source Title">{note.subjectName}</cite>
                                    </div>
                                    <Badge bg="light" text="dark">
                                        {format(new Date(note.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                    </Badge>
                                </footer>
                            </blockquote>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <Alert variant="secondary" className="text-center p-4">
                    <MessageSquareQuote className="mb-2" size={32} />
                    <p className="mb-0">Nenhuma anotação feita por seus professores.</p>
                </Alert>
            )}
        </div>
    );
};