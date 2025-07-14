import { Modal, Button, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuthContext } from '../../../contexts/auth/AuthContext';
import {Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/auth/api';
import type { InternalRequestDetails, UpdateRequestData } from '../../../types';
import {useEffect} from "react";
import {RichTextEditor} from "../../common/RichTextEditor.tsx";

const updateRequest = ({ id, ...data }: { id: number } & UpdateRequestData) => {
    return api.patch(`/api/v1/internal-requests/${id}/status`, data);
};

const SafeHtmlRenderer = ({ html }: { html: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: html || '' }} />;
};

export const RequestDetailsModal = ({ request, show, onHide }: { request: InternalRequestDetails | null, show: boolean, onHide: () => void }) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const { control, register, handleSubmit, reset } = useForm<UpdateRequestData>();

    const { mutate, isPending, error } = useMutation({
        mutationFn: updateRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['internalRequests'] });
            onHide();
        }
    });

    useEffect(() => {
        if (request) {
            reset({
                status: request.status,
                resolutionNotes: request.resolutionNotes || ''
            });
        }
    }, [request, reset]);

    if (!request) {
        return null;
    }

    const isHandler = user?.id === request.handler?.id;

    const onSubmit: SubmitHandler<UpdateRequestData> = (formData) => {
        mutate({ id: request.id, ...formData });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{request.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Requisitante:</strong> {request.requester.fullName}</p>
                <div>
                    <strong>Descrição:</strong>
                    <div className="mt-1 border-start ps-3">
                        <SafeHtmlRenderer html={request.description} />
                    </div>
                </div>
                <hr />

                {isHandler ? (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Atualizar Status</Form.Label>
                                    <Form.Select {...register('status')}>
                                        <option value="PENDING">Pendente</option>
                                        <option value="IN_PROGRESS">Em Andamento</option>
                                        <option value="COMPLETED">Concluído</option>
                                        <option value="REJECTED">Rejeitado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Notas de Resolução</Form.Label>
                            <Controller
                                name="resolutionNotes"
                                control={control}
                                render={({ field }) => <RichTextEditor value={field.value || ''} onEditorChange={field.onChange} />}
                            />
                        </Form.Group>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Spinner size="sm"/> : 'Atualizar Requisição'}
                        </Button>
                        {error && <Alert variant="danger" className="mt-3">{(error as Error).message}</Alert>}
                    </Form>
                ) : (
                    <div>
                        <h5>Resolução</h5>
                        <p className="text-muted">{request.resolutionNotes || "Ainda não há notas de resolução."}</p>
                    </div>
                )}

                <div className="mt-4">
                    <h5>Comentários</h5>
                    <p className="text-muted small">Funcionalidade de comentários em breve...</p>
                </div>
            </Modal.Body>
        </Modal>
    );
};