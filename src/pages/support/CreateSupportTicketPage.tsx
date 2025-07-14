import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {Form, Button, Alert, Card, Row, Col, Spinner} from 'react-bootstrap';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import api from '../../services/auth/api';
import { RichTextEditor } from '../../features/common/RichTextEditor';
import { Send, ArrowLeft } from 'lucide-react';
import type { CreateSupportTicketData } from '../../types';


const createTicketRequest = (data: CreateSupportTicketData) => {
    return api.post('/api/v1/support-tickets', data);
};

export default function CreateSupportTicketPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { control, register, handleSubmit, formState: { errors } } = useForm<CreateSupportTicketData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: createTicketRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['mySupportTickets'] });
            navigate('/my-support-tickets');
        },
    });

    const onSubmit: SubmitHandler<CreateSupportTicketData> = (formData) => {
        mutate(formData);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Abrir Novo Chamado</h1>
                <Link to="/my-support-tickets" className="btn btn-outline-secondary">
                    <ArrowLeft size={18} className="me-2" />
                    Ver Meus Chamados
                </Link>
            </div>
            <p className="lead text-muted">Descreva seu problema ou dúvida para que nossa equipe técnica possa ajudar.</p>

            <Card className="shadow-sm mt-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {error && <Alert variant="danger">{(error as Error).message}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Não consigo acessar o Wi-Fi da biblioteca"
                                {...register('title', { required: 'O título é obrigatório.' })}
                                isInvalid={!!errors.title}
                            />
                            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Select {...register('category', { required: true })}>
                                        <option value="GENERAL_QUESTION">Dúvida Geral</option>
                                        <option value="LOGIN_ISSUE">Problema de Login</option>
                                        <option value="SYSTEM_BUG">Erro no Sistema</option>
                                        <option value="ACCOUNT_PROBLEM">Problema na Conta</option>
                                        <option value="OTHER">Outro</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prioridade</Form.Label>
                                    <Form.Select {...register('priority', { required: true })}>
                                        <option value="LOW">Baixa</option>
                                        <option value="MEDIUM">Média</option>
                                        <option value="HIGH">Alta</option>
                                        <option value="CRITICAL">Crítica</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição Completa do Problema</Form.Label>
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
                                {isPending ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} className="me-2" />
                                        Enviar Chamado
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}