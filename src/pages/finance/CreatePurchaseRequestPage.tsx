import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createPurchaseRequest } from '../../services/employee/financeApi';
import type { CreatePurchaseRequestData } from '../../types';
import { ArrowLeft, Send } from 'lucide-react';

const schema: yup.ObjectSchema<CreatePurchaseRequestData> = yup.object({
    itemName: yup.string().required('O nome do item é obrigatório.'),
    quantity: yup.number()
        .typeError('A quantidade é obrigatória e deve ser um número.')
        .min(1, 'A quantidade deve ser pelo menos 1.')
        .required('A quantidade é obrigatória.'),
    justification: yup.string(),
});
const CreatePurchaseRequestPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<CreatePurchaseRequestData>({
        resolver: yupResolver(schema),
        defaultValues: {
            itemName: '',
            quantity: 1,
            justification: ''
        }
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: createPurchaseRequest,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['purchaseRequests'] });
            navigate('/dashboard');
        },
    });

    const onSubmit: SubmitHandler<CreatePurchaseRequestData> = (formData) => {
        mutate(formData);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Nova Requisição de Compra</h1>
                <Link to="/dashboard" className="btn btn-outline-secondary">
                    <ArrowLeft size={18} className="me-2" />
                    Voltar
                </Link>
            </div>
            <p className="text-muted">Preencha os detalhes do item que você precisa. Sua solicitação será enviada para análise.</p>

            <Card className="shadow-sm mt-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {error && <Alert variant="danger">Erro ao criar requisição: {(error as Error).message}</Alert>}

                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome do Item / Serviço</Form.Label>
                                    <Form.Control type="text" {...register('itemName')} isInvalid={!!errors.itemName} />
                                    <Form.Control.Feedback type="invalid">{errors.itemName?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantidade</Form.Label>
                                    <Form.Control type="number" {...register('quantity')} isInvalid={!!errors.quantity} />
                                    <Form.Control.Feedback type="invalid">{errors.quantity?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Justificativa (Opcional)</Form.Label>
                            <Form.Control as="textarea" rows={4} {...register('justification')} />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Spinner as="span" size="sm" className="me-2"/> : <Send size={18} className="me-2" />}
                                {isPending ? 'Enviando...' : 'Enviar Requisição'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreatePurchaseRequestPage;