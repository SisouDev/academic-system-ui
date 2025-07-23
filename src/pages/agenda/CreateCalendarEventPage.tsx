import { useForm, type SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createCalendarEvent, getDepartmentsForSelection } from '../../services/employee/calendarApi';
import type { CreateCalendarEventData } from '../../types';
import { ArrowLeft, CalendarPlus } from 'lucide-react';

const schema: yup.ObjectSchema<CreateCalendarEventData> = yup.object({
    title: yup.string().required('O título é obrigatório.'),
    description: yup.string().required('A descrição é obrigatória.'),
    type: yup.string().oneOf(['MEETING', 'ACADEMIC_EVENT', 'HOLIDAY', 'OTHER']).required(),
    startTime: yup.string().required('A data/hora de início é obrigatória.'),
    endTime: yup.string().required('A data/hora de término é obrigatória.'),
    scope: yup.string().oneOf(['INSTITUTION', 'DEPARTMENT']).required(),
    targetDepartmentId: yup.number().nullable().when('scope', {
        is: 'DEPARTMENT',
        then: (schema) => schema.typeError('Selecione um departamento').required('Se o escopo é departamental, o departamento é obrigatório.'),
        otherwise: (schema) => schema.transform(() => null),
    }),
});

const CreateCalendarEventPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateCalendarEventData>({
        resolver: yupResolver(schema),
        defaultValues: { scope: 'INSTITUTION' }
    });

    const scopeValue = watch('scope');

    const { data: departments, isLoading: isLoadingDepartments } = useQuery({
        queryKey: ['departmentsForSelection'],
        queryFn: getDepartmentsForSelection,
    });

    const mutation = useMutation({
        mutationFn: createCalendarEvent,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['secretaryDashboardData'] });
            navigate('/agenda');
        },
    });

    const onSubmit: SubmitHandler<CreateCalendarEventData> = (formData) => {
        const dataToSubmit = {
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            targetDepartmentId: formData.scope === 'INSTITUTION' ? null : formData.targetDepartmentId,
        };
        mutation.mutate(dataToSubmit);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Agendar Novo Evento</h1>
                <Link to="/agenda" className="btn btn-outline-secondary">
                    <ArrowLeft size={18} className="me-2" />
                    Voltar para Agenda
                </Link>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {mutation.error && <Alert variant="danger">Erro: {mutation.error.message}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label>Título do Evento</Form.Label>
                            <Form.Control type="text" {...register('title')} isInvalid={!!errors.title} />
                            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data e Hora de Início</Form.Label>
                                    <Form.Control type="datetime-local" {...register('startTime')} isInvalid={!!errors.startTime} />
                                    <Form.Control.Feedback type="invalid">{errors.startTime?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data e Hora de Término</Form.Label>
                                    <Form.Control type="datetime-local" {...register('endTime')} isInvalid={!!errors.endTime} />
                                    <Form.Control.Feedback type="invalid">{errors.endTime?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select {...register('type')} isInvalid={!!errors.type}>
                                <option value="MEETING">Reunião</option>
                                <option value="ACADEMIC_EVENT">Evento Acadêmico</option>
                                <option value="HOLIDAY">Feriado</option>
                                <option value="OTHER">Outro</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Visibilidade (Escopo)</Form.Label>
                            <div>
                                <Form.Check inline type="radio" label="Institucional (Todos)" value="INSTITUTION" {...register('scope')} />
                                <Form.Check inline type="radio" label="Departamental" value="DEPARTMENT" {...register('scope')} />
                            </div>
                        </Form.Group>

                        {scopeValue === 'DEPARTMENT' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Departamento</Form.Label>
                                <Form.Select {...register('targetDepartmentId')} isInvalid={!!errors.targetDepartmentId} disabled={isLoadingDepartments}>
                                    <option value="">{isLoadingDepartments ? 'Carregando...' : 'Selecione um departamento'}</option>
                                    {departments?.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.targetDepartmentId?.message}</Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control as="textarea" rows={4} {...register('description')} isInvalid={!!errors.description} />
                            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? <Spinner as="span" size="sm" className="me-2"/> : <CalendarPlus size={18} className="me-2" />}
                                {mutation.isPending ? 'Agendando...' : 'Agendar Evento'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateCalendarEventPage;