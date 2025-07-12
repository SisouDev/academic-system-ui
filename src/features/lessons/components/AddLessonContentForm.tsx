import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useForm, Controller, type SubmitHandler} from 'react-hook-form';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../../services/auth/api';
import { RichTextEditor } from '../../common/RichTextEditor';


type FormData = {
    content: string;
};

interface AddLessonContentFormProps {
    lessonId: number | null;
    onDone: () => void;
}

type CreateContentData = {
    lessonId: number | null;
    type: string;
    content: string;
    displayOrder: number;
};

const addContentRequest = (data: CreateContentData) => api.post('/api/v1/lesson-contents', data);

export const AddLessonContentForm = ({ lessonId, onDone }: AddLessonContentFormProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: { content: '' }
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: addContentRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjectDetails'] });
            reset();
            onDone();
        },
    });

    const onSubmit: SubmitHandler<FormData> = (formData) => {
        mutate({ ...formData, lessonId, displayOrder: 1, type: "TEXT" });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{error.message}</Alert>}

            <Form.Group>
                <Controller
                    name="content"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <RichTextEditor
                            value={value}
                            onEditorChange={(content) => onChange(content)}
                        />
                    )}
                />
            </Form.Group>

            <Button type="submit" disabled={isPending} className="mt-3">
                {isPending ? <Spinner size="sm" /> : 'Salvar Conteúdo'}
            </Button>
        </Form>
    );
};