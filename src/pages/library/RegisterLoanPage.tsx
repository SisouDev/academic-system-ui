import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Card, Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { searchLibraryItems, createLoan } from '../../services/employee/libraryApi';
import { AsyncSelect, type SelectOption } from '../../components/common/AsyncSelect';
import type { CreateLoanData, PersonSummary, LibraryItemDetails } from '../../types';
import { addDays, format } from 'date-fns';
import type { LoadOptions } from 'react-select-async-paginate';
import type { GroupBase } from 'react-select';
import {searchPeople} from "../../services/user/userApi.ts";

export const RegisterLoanPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedBorrower, setSelectedBorrower] = useState<SelectOption | null>(null);
    const [selectedItem, setSelectedItem] = useState<SelectOption | null>(null);

    const { control, handleSubmit, formState: { errors }, watch } = useForm<CreateLoanData>({
        defaultValues: {
            dueDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
        }
    });

    const mutation = useMutation({
        mutationFn: createLoan,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['loans'] });
            void queryClient.invalidateQueries({ queryKey: ['librarianDashboardData'] });
            navigate('/library/loans');
        },
    });

    const loadPeopleOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, null> = async (search) => {
        const people = await searchPeople(search);
        return {
            options: people.map((p: PersonSummary) => ({ value: p.id, label: `${p.fullName} (${p.email})` })),
            hasMore: false,
        };
    };

    const loadLibraryItemsOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, null> = async (search) => {
        const items = await searchLibraryItems(search);
        const availableItems = items.filter(item => item.availableCopies > 0);
        return {
            options: availableItems.map((i: LibraryItemDetails) => ({ value: i.id, label: `${i.title} (Autor: ${i.author || 'N/A'})` })),
            hasMore: false,
        };
    };

    const onSubmit: SubmitHandler<CreateLoanData> = (data) => {
        mutation.mutate(data);
    };

    return (
        <Container fluid className="p-4">
            <h1>Registar Novo Empréstimo</h1>
            <hr />
            <Card as="form" onSubmit={handleSubmit(onSubmit)} className="shadow-sm">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Procurar Usuário (Aluno/Funcionário)</Form.Label>
                                <Controller
                                    name="borrowerId"
                                    control={control}
                                    rules={{ required: 'É obrigatório selecionar um usuário.' }}
                                    render={({ field }) => (
                                        <AsyncSelect
                                            placeholder="Digite o nome ou email..."
                                            loadOptions={loadPeopleOptions}
                                            value={selectedBorrower}
                                            onChange={(option) => {
                                                setSelectedBorrower(option);
                                                field.onChange(option ? option.value : null);
                                            }}
                                        />
                                    )}
                                />
                                {errors.borrowerId && <Form.Text className="text-danger">{errors.borrowerId.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Procurar Item da Biblioteca</Form.Label>
                                <Controller
                                    name="itemId"
                                    control={control}
                                    rules={{ required: 'É obrigatório selecionar um item.' }}
                                    render={({ field }) => (
                                        <AsyncSelect
                                            placeholder="Digite o título do livro..."
                                            loadOptions={loadLibraryItemsOptions}
                                            value={selectedItem}
                                            onChange={(option) => {
                                                setSelectedItem(option);
                                                field.onChange(option ? option.value : null);
                                            }}
                                            isDisabled={!watch('borrowerId')}
                                        />
                                    )}
                                />
                                {errors.itemId && <Form.Text className="text-danger">{errors.itemId.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Data de Devolução</Form.Label>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    rules={{ required: 'A data de devolução é obrigatória.' }}
                                    render={({ field }) => (
                                        <Form.Control type="date" {...field} />
                                    )}
                                />
                                {errors.dueDate && <Form.Text className="text-danger">{errors.dueDate.message}</Form.Text>}
                            </Form.Group>
                        </Col>
                    </Row>

                    {mutation.isError && <Alert variant="danger" className="mt-3">Erro: {mutation.error.message}</Alert>}
                </Card.Body>
                <Card.Footer className="text-end">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? <Spinner as="span" size="sm" /> : 'Confirmar Empréstimo'}
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};