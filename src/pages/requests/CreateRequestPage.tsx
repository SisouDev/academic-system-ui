import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import api from '../../services/auth/api';
import { RichTextEditor } from '../../features/common/RichTextEditor';
import { Send, ArrowLeft } from 'lucide-react';
import type {DepartmentSummary, CreateInternalRequestData, HateoasCollection} from '../../types';

const getDepartments = async (): Promise<DepartmentSummary[]> => {
    const { data } = await api.get<DepartmentSummary[] | HateoasCollection<DepartmentSummary>>('/api/v1/departments/all-for-selection');

    if (data && '_embedded' in data) {
        const embeddedKey = Object.keys(data._embedded)[0];
        return data._embedded[embeddedKey];
    }

    return Array.isArray(data) ? data : [];
};
const createRequest = (data: CreateInternalRequestData) => {
    return api.post('/api/v1/internal-requests', data);
};

export default function CreateRequestPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: departments, isLoading: isLoadingDepartments } = useQuery({
        queryKey: ['departmentsForSelection'],
        queryFn: getDepartments,
    });

    const { control, register, handleSubmit, formState: { errors } } = useForm<CreateInternalRequestData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['internalRequests'] });
            navigate('/internal-requests');
        },
    });

    const onSubmit: SubmitHandler<CreateInternalRequestData> = (formData) => {
        mutate(formData);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Abrir Nova Requisição</h1>
                <Link to="/internal-requests" className="btn btn-outline-secondary">
                    <ArrowLeft size={18} className="me-2" />
                    Voltar para a Lista
                </Link>
            </div>
            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {error && <Alert variant="danger">{(error as Error).message}</Alert>}
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Projetor da sala 301 não liga"
                                        {...register('title', { required: 'O título é obrigatório.' })}
                                        isInvalid={!!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select {...register('type', { required: true })}>
                                        <option value="MATERIAL_REQUEST">Requisição de Material</option>
                                        <option value="MAINTENANCE_REQUEST">Requisição de Manutenção</option>
                                        <option value="HR_REQUEST">Requisição de RH</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Urgência</Form.Label>
                                    <Form.Select {...register('urgency', { required: true })}>
                                        <option value="LOW">Baixa</option>
                                        <option value="MEDIUM">Média</option>
                                        <option value="HIGH">Alta</option>
                                        <option value="CRITICAL">Crítica</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Departamento de Destino</Form.Label>
                                    <Form.Select {...register('targetDepartmentId', { required: "Selecione um departamento", valueAsNumber: true })} disabled={isLoadingDepartments} isInvalid={!!errors.targetDepartmentId}>
                                        <option value="">Selecione...</option>
                                        {departments?.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.targetDepartmentId?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição Detalhada</Form.Label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "A descrição é obrigatória." }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />
                                        {fieldState.error && <div className="d-block invalid-feedback mt-4">{fieldState.error.message}</div>}
                                    </>
                                )}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={isPending}>
                                <Send size={18} className="me-2" />
                                {isPending ? 'Enviando...' : 'Enviar Requisição'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}