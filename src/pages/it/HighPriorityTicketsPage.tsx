import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Container, Spinner, Alert, Pagination, Card } from 'react-bootstrap';
import type { PagedResponse, SupportTicketDetails } from '../../types';
import {HighPriorityTicketsTable} from "../../features/it/HighPriorityTicketsTable.tsx";
import {getSupportTickets} from "../../services/employee/itApi.ts";

export const HighPriorityTicketsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PagedResponse<SupportTicketDetails>, Error>({
        queryKey: ['supportTickets', 'HIGH', currentPage],
        queryFn: () => getSupportTickets({
            priority: 'HIGH',
            status: 'OPEN',
            page: currentPage,
            size: 10
        }),
        placeholderData: keepPreviousData,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const ticketList = data?._embedded?.supportTicketDetailsDtoList ?? [];

    return (
        <Container fluid className="p-4">
            <h1 className="mb-1">Tickets de Suporte (Prioridade Alta)</h1>
            <p className="lead text-muted">
                Lista de todos os chamados abertos com prioridade alta que requerem atenção.
            </p>
            <hr className="my-4" />

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading && <div className="text-center p-5"><Spinner animation="border" /></div>}
                    {isError && <Alert variant="danger">Erro ao carregar os chamados: {error.message}</Alert>}

                    {data && (
                        <>
                            <HighPriorityTicketsTable tickets={ticketList} />
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0 || isPlaceholderData} />
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || isPlaceholderData} />
                                    <Pagination.Item active>{currentPage + 1}</Pagination.Item>
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= data.page.totalPages - 1 || isPlaceholderData} />
                                    <Pagination.Last onClick={() => handlePageChange(data.page.totalPages - 1)} disabled={currentPage >= data.page.totalPages - 1 || isPlaceholderData} />
                                </Pagination>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};