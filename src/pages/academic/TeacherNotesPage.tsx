import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner, Card, Form, Button } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../../services/auth/api';
import { ArrowLeft } from 'lucide-react';
import type { TeacherNote, HateoasCollection } from '../../types';
import { parse } from 'date-fns'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const getNotes = async (enrollmentId?: string): Promise<TeacherNote[]> => {
    if (!enrollmentId) return [];
    const { data } = await api.get<HateoasCollection<TeacherNote>>(`/api/v1/teacher-notes?enrollmentId=${enrollmentId}`);
    return data._embedded?.teacherNoteDtoList || [];
};

const createNoteRequest = (data: { enrollmentId: number, content: string }) => {
    return api.post('/api/v1/teacher-notes', data);
};

export default function TeacherNotesPage() {
    const { enrollmentId } = useParams<{ enrollmentId: string }>();
    const queryClient = useQueryClient();

    const { data: notes, isLoading, isError, error } = useQuery({
        queryKey: ['teacherNotes', enrollmentId],
        queryFn: () => getNotes(enrollmentId),
        enabled: !!enrollmentId,
    });

    const { mutate: createNote, isPending } = useMutation({
        mutationFn: createNoteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacherNotes', enrollmentId] });
            reset();
        }
    });

    const { register, handleSubmit, reset } = useForm<{ content: string }>();
    const onSubmit: SubmitHandler<{ content: string }> = (formData) => {
        createNote({ enrollmentId: Number(enrollmentId), content: formData.content });
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar anotações: {(error as Error).message}</Alert>;

    return (
        <div>
            <Link to={`/my-classes/`} className="btn btn-light mb-4">
                <ArrowLeft size={18} className="me-2" />
                Voltar para Turmas
            </Link>

            <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Anotações do Professor</h1>
            <p className="text-muted">Adicione anotações particulares sobre o desempenho e comportamento do aluno nesta disciplina.</p>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Label>Nova Anotação</Form.Label>
                            <Form.Control as="textarea" rows={3} {...register('content', { required: true })} placeholder="Escreva sua anotação aqui..." />
                        </Form.Group>
                        <Button type="submit" className="mt-3" disabled={isPending}>
                            {isPending ? <Spinner size="sm" /> : 'Salvar Anotação'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {notes && notes.length > 0 ? (
                notes.map(note => (
                    <Card key={note.id} className="mb-3">
                        <Card.Body>
                            <Card.Text>{note.content}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted small d-flex justify-content-between">
                            <span>Autor: {note.authorName}</span>
                            <span>
                                Criado em:{' '}
                                {format(
                                    parse(note.createdAt, 'dd/MM/yyyy HH:mm', new Date()),
                                    'Pp',
                                    { locale: ptBR }
                                )}
                            </span>
                        </Card.Footer>
                    </Card>
                ))
            ) : (
                <Alert variant="secondary">Nenhuma anotação encontrada para este aluno na disciplina.</Alert>
            )}
        </div>
    );
}