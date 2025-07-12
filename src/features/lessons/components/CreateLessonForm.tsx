import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useForm, type SubmitHandler, Controller} from 'react-hook-form';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../../services/auth/api';
import {RichTextEditor} from "../../common/RichTextEditor.tsx";

type CreateLessonFormData = {
    topic: string;
    description: string;
    lessonDate: string;
};

type CreateLessonRequest = CreateLessonFormData & {
    courseSectionId: number;
};

interface CreateLessonFormProps {
    courseSectionId?: number;
    onDone: () => void;
}

const createLessonRequest = (data: CreateLessonRequest) => api.post('/api/v1/lessons', data);

export const CreateLessonForm = ({ courseSectionId, onDone }: CreateLessonFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, control } = useForm<CreateLessonFormData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createLessonRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjectDetails'] });
            onDone();
        },
        onError: (err) => {
            console.error("Erro ao criar aula:", err);
        }
    });

    const onSubmit: SubmitHandler<CreateLessonFormData> = (formData) => {
        if (!courseSectionId) {
            console.error("ID da turma não foi fornecido.");
            return;
        }
        mutate({ ...formData, courseSectionId });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{error.message}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>Tópico da Aula</Form.Label>
                <Form.Control
                    type="text"
                    {...register('topic', { required: 'Tópico é obrigatório' })}
                    isInvalid={!!errors.topic}
                />
                <Form.Control.Feedback type="invalid">{errors.topic?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Descrição (Opcional)</Form.Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <RichTextEditor
                            value={value}
                            onEditorChange={onChange}
                        />
                    )}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Data da Aula</Form.Label>
                <Form.Control
                    type="date"
                    {...register('lessonDate', { required: 'A data é obrigatória' })}
                    isInvalid={!!errors.lessonDate}
                />
                <Form.Control.Feedback type="invalid">{errors.lessonDate?.message}</Form.Control.Feedback>
            </Form.Group>


            <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner size="sm" /> : 'Criar Aula'}
            </Button>
        </Form>
    );
};