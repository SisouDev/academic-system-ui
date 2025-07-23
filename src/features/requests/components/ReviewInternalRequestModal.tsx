import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { InternalRequestSummary } from '../../../types';

interface ReviewData {
    status: 'APPROVED_BY_ASSISTANT' | 'REJECTED_BY_ASSISTANT';
    resolutionNotes?: string;
}

interface ReviewModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (data: ReviewData) => void;
    request: InternalRequestSummary | null;
    isSubmitting: boolean;
}

export const ReviewInternalRequestModal = ({ show, onHide, onConfirm, request, isSubmitting }: ReviewModalProps) => {
    const { register, handleSubmit, setValue } = useForm<ReviewData>();

    const onSubmit: SubmitHandler<ReviewData> = (data) => {
        onConfirm(data);
    };

    if (!request) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Analisar Requisição #{request.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Título:</strong> {request.title}</p>
                    <p><strong>Solicitante:</strong> {request.requesterName}</p>
                    <hr/>
                    <Form.Group className="mb-3">
                        <Form.Label>Notas da Resolução (Opcional)</Form.Label>
                        <Form.Control as="textarea" rows={3} {...register('resolutionNotes')} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => {
                        setValue('status', 'REJECTED_BY_ASSISTANT');
                        void handleSubmit(onSubmit)();
                    }} disabled={isSubmitting}>
                        Rejeitar
                    </Button>
                    <Button variant="success" onClick={() => {
                        setValue('status', 'APPROVED_BY_ASSISTANT');
                        void handleSubmit(onSubmit)();
                    }} disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm"/> : 'Aprovar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};