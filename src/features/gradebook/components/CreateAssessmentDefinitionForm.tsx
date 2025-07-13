import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import api from '../../../services/auth/api';
import type { CreateAssessmentDefinitionData } from '../../../types';

interface CreateAssessmentFormProps {
    sectionId: number;
    onDone: () => void;
}

const createAssessmentDefRequest = (data: CreateAssessmentDefinitionData) => api.post('/api/v1/assessment-definitions', data);

export const CreateAssessmentDefinitionForm = ({ sectionId, onDone }: CreateAssessmentFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAssessmentDefinitionData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createAssessmentDefRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['gradebook', String(sectionId)] });
            onDone();
        }
    });

    const onSubmit: SubmitHandler<CreateAssessmentDefinitionData> = (formData) => {
        mutate({ ...formData, courseSectionId: sectionId });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{(error as Error).message}</Alert>}
            <Row>
                <Col md={8}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            {...register('title', { required: "O título é obrigatório" })}
                            isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Peso</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            {...register('weight', { required: "O peso é obrigatório" })}
                            isInvalid={!!errors.weight}
                        />
                        <Form.Control.Feedback type="invalid">{errors.weight?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select {...register('type')}>
                            <option value="EXAM">Prova</option>
                            <option value="PROJECT">Trabalho</option>
                            <option value="QUIZ">Quiz</option>
                            <option value="ASSIGNMENT">Atividade</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('assessmentDate', { required: "A data é obrigatória" })}
                            isInvalid={!!errors.assessmentDate}
                        />
                        <Form.Control.Feedback type="invalid">{errors.assessmentDate?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Button type="submit" disabled={isPending}>{isPending ? <Spinner size="sm"/> : 'Criar Avaliação'}</Button>
        </Form>
    );
};