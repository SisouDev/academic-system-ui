import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import {type SubmitHandler, useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {type CreateLibraryItemData, createLibraryItemSchema, type LibraryItemDetails} from '../../../types';
import React from "react";

interface LibraryItemFormProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: CreateLibraryItemData) => void;
    isSubmitting: boolean;
    initialData?: LibraryItemDetails | null;
}

export const LibraryItemForm = ({
                                    show,
                                    onHide,
                                    onSubmit,
                                    isSubmitting,
                                    initialData
                                }: LibraryItemFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateLibraryItemData>({
        resolver: yupResolver(createLibraryItemSchema),
    });

    React.useEffect(() => {
        if (show) {
            if (initialData) {
                reset({
                    title: initialData.title,
                    author: initialData.author || '',
                    isbn: initialData.isbn || '',
                    publisher: initialData.publisher || '',
                    publicationYear: initialData.publicationYear,
                    type: initialData.type,
                    totalCopies: initialData.totalCopies,
                });
            } else {
                reset({
                    title: '',
                    author: '',
                    isbn: '',
                    publisher: '',
                    publicationYear: new Date().getFullYear(),
                    totalCopies: 1,
                    type: 'BOOK',
                });
            }
        }
    }, [initialData, show, reset]);

    const handleFormSubmit: SubmitHandler<CreateLibraryItemData> = (data) => {
        onSubmit(data);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialData ? 'Editar Item' : 'Adicionar Novo Item ao Acervo'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('title')}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.title?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Autor</Form.Label>
                                <Form.Control type="text" {...register('author')} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>ISBN</Form.Label>
                                <Form.Control type="text" {...register('isbn')} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Editora</Form.Label>
                                <Form.Control type="text" {...register('publisher')} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ano de Publicação</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register('publicationYear')}
                                    isInvalid={!!errors.publicationYear}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.publicationYear?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select {...register('type')} isInvalid={!!errors.type}>
                                    <option value="BOOK">Livro</option>
                                    <option value="MAGAZINE">Revista</option>
                                    <option value="JOURNAL">Periódico</option>
                                    <option value="THESIS">Tese</option>
                                    <option value="OTHER">Outro</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.type?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total de Cópias</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register('totalCopies')}
                                    isInvalid={!!errors.totalCopies}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.totalCopies?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" /> : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};