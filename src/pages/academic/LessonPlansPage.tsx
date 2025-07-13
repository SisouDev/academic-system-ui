import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/auth/api';
import { RichTextEditor } from '../../features/common/RichTextEditor';
import { BookCheck, Save } from 'lucide-react';
import type { LessonPlanData, LessonPlanFormData } from '../../types';
import { useEffect } from 'react';
import axios from 'axios';

const getLessonPlan = async (sectionId?: string): Promise<LessonPlanData | null> => {
    if (!sectionId) return null;
    try {
        const { data } = await api.get(`/api/v1/course-sections/${sectionId}/lesson-plan`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const saveLessonPlan = (data: LessonPlanFormData) => api.post('/api/v1/lesson-plans', data);

export default function LessonPlanPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: existingPlan, isLoading, isError, error } = useQuery({
        queryKey: ['lessonPlan', sectionId],
        queryFn: () => getLessonPlan(sectionId),
        enabled: !!sectionId,
    });

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<LessonPlanFormData>();

    useEffect(() => {
        if (existingPlan) {
            reset({
                objectives: existingPlan.objectives,
                syllabusContent: existingPlan.syllabusContent,
                bibliography: existingPlan.bibliography,
            });
        }
    }, [existingPlan, reset]);

    const { mutate, isPending, error: mutationError } = useMutation({
        mutationFn: saveLessonPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessonPlan', sectionId] });
            navigate(`/my-classes/${sectionId}`);
        },
    });

    const onSubmit = (formData: LessonPlanFormData) => {
        mutate({ ...formData, courseSectionId: Number(sectionId) });
    };

    if (isLoading) {
        return <div className="text-center p-5"><Spinner /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar o plano de aula: {error instanceof Error ? error.message : 'Erro desconhecido'}</Alert>;
    }

    return (
        <div>
            <div className="d-flex align-items-center mb-4">
                <BookCheck size={40} className="text-primary me-3"/>
                <div>
                    <h1 style={{ fontFamily: 'Raleway, sans-serif' }} className="mb-0">Plano de Aula</h1>
                    <p className="text-muted">Defina os objetivos, conteúdo e bibliografia para a turma.</p>
                </div>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {mutationError && <Alert variant="danger">{mutationError.message}</Alert>}

                        <Form.Group className="mb-4">
                            <Form.Label as="h5">Objetivos</Form.Label>
                            <Controller
                                name="objectives"
                                control={control}
                                render={({ field }) => <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label as="h5">Conteúdo Programático</Form.Label>
                            <Controller
                                name="syllabusContent"
                                control={control}
                                render={({ field }) => <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label as="h5">Bibliografia</Form.Label>
                            <Controller
                                name="bibliography"
                                control={control}
                                render={({ field }) => <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={isPending || !isDirty}>
                                <Save size={18} className="me-2" />
                                {isPending ? 'Salvando...' : 'Salvar Plano de Aula'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}