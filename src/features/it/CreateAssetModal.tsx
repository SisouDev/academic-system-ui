import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { CreateAssetData } from '../../types';

interface CreateAssetModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: CreateAssetData) => void;
    isSaving: boolean;
}

const schema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório.'),
    assetTag: yup.string().required('A etiqueta de patrimônio é obrigatória.'),
    serialNumber: yup.string().required('O número de série é obrigatório.'),
    purchaseDate: yup.string().required('A data da compra é obrigatória.'),
    purchaseCost: yup.number().typeError('O custo deve ser um número.').positive('O custo deve ser positivo.').required('O custo é obrigatório.'),
});

export const CreateAssetModal = ({ show, onHide, onSave, isSaving }: CreateAssetModalProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAssetData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<CreateAssetData> = (data) => {
        onSave(data);
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton><Modal.Title>Registrar Novo Ativo de TI</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome / Modelo</Form.Label>
                        <Form.Control type="text" {...register('name')} isInvalid={!!errors.name} />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Etiqueta de Patrimônio</Form.Label>
                                <Form.Control type="text" {...register('assetTag')} isInvalid={!!errors.assetTag} />
                                <Form.Control.Feedback type="invalid">{errors.assetTag?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de Série</Form.Label>
                                <Form.Control type="text" {...register('serialNumber')} isInvalid={!!errors.serialNumber} />
                                <Form.Control.Feedback type="invalid">{errors.serialNumber?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data da Compra</Form.Label>
                                <Form.Control type="date" {...register('purchaseDate')} isInvalid={!!errors.purchaseDate} />
                                <Form.Control.Feedback type="invalid">{errors.purchaseDate?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Custo de Aquisição (R$)</Form.Label>
                                <Form.Control type="number" step="0.01" {...register('purchaseCost')} isInvalid={!!errors.purchaseCost} />
                                <Form.Control.Feedback type="invalid">{errors.purchaseCost?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? <Spinner size="sm" as="span" className="me-2"/> : null}
                        {isSaving ? 'Salvando...' : 'Salvar Ativo'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};