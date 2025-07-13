import { useMutation, useQueryClient } from '@tanstack/react-query';
import {Controller, type SubmitHandler, useForm} from 'react-hook-form';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../../services/auth/api';
import { RichTextEditor } from '../../common/RichTextEditor.tsx';
import type {CreateAnnouncementData} from "../../../types";

type AnnouncementFormData = {
    title: string;
    content: string;
};

interface CreateAnnouncementFormProps {
    sectionId: number;
    onDone: () => void;
}

const createAnnouncementRequest = (data: CreateAnnouncementData) => api.post('/api/v1/announcements', data);

export const CreateAnnouncementForm = ({ sectionId, onDone }: CreateAnnouncementFormProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm<AnnouncementFormData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createAnnouncementRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements', sectionId] });
            reset();
            onDone();
        },
    });

    const onSubmit: SubmitHandler<AnnouncementFormData> = (formData) => {
        mutate({
            ...formData,
            targetCourseSectionId: sectionId,
            scope: 'COURSE_SECTION',
            expiresAt: null
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{error.message}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Título do Aviso</Form.Label>
                <Form.Control
                    type="text"
                    {...register('title', { required: "O título é obrigatório." })}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Conteúdo</Form.Label>
                <Controller
                    name="content"
                    control={control}
                    rules={{ required: "O conteúdo não pode estar vazio."}}
                    render={({ field, fieldState }) => (
                        <>
                            <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />
                            {fieldState.error && <div className="d-block invalid-feedback">{fieldState.error.message}</div>}
                        </>
                    )}
                />
            </Form.Group>

            <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner size="sm" className="me-2" /> : null}
                Publicar Aviso
            </Button>
        </Form>
    );
};