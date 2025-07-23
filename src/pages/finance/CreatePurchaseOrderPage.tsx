import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createPurchaseOrder } from '../../services/employee/financeApi';
import type { CreatePurchaseOrderData } from '../../types';
import { ArrowLeft, Send } from 'lucide-react';

const schema = yup.object().shape({
    supplier: yup.string().required('O nome do fornecedor é obrigatório.'),
    description: yup.string().required('A descrição é obrigatória.'),
    amount: yup.number().positive('O valor deve ser positivo.').required('O valor é obrigatório.'),
    dueDate: yup.string().required('A data de vencimento é obrigatória.'),
});

const CreatePurchaseOrderPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<CreatePurchaseOrderData>({
        resolver: yupResolver(schema)
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: createPurchaseOrder,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
            navigate('/finance/purchase-orders');
        },
    });

    const onSubmit: SubmitHandler<CreatePurchaseOrderData> = (formData) => {
        mutate(formData);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Nova Ordem de Compra</h1>
                <Link to="/finance/purchase-orders" className="btn btn-outline-secondary">
                    <ArrowLeft size={18} className="me-2" />
                    Voltar para a Lista
                </Link>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {error && <Alert variant="danger">Erro ao criar ordem de compra: {error.message}</Alert>}

                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fornecedor</Form.Label>
                                    <Form.Control type="text" {...register('supplier')} isInvalid={!!errors.supplier} />
                                    <Form.Control.Feedback type="invalid">{errors.supplier?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor (R$)</Form.Label>
                                    <Form.Control type="number" step="0.01" {...register('amount')} isInvalid={!!errors.amount} />
                                    <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vencimento</Form.Label>
                                    <Form.Control type="date" {...register('dueDate')} isInvalid={!!errors.dueDate} />
                                    <Form.Control.Feedback type="invalid">{errors.dueDate?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control as="textarea" rows={4} {...register('description')} isInvalid={!!errors.description} />
                            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Spinner as="span" size="sm" className="me-2"/> : <Send size={18} className="me-2" />}
                                {isPending ? 'Enviando...' : 'Enviar Solicitação'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreatePurchaseOrderPage;