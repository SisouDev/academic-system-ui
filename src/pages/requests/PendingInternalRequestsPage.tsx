import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Container, Spinner, Alert, Pagination, Card } from 'react-bootstrap';
import { PendingRequestsTable } from '../../features/requests/components/PendingRequestsTable';
import type { PagedResponse, InternalRequestDetails } from '../../types';
import {getInternalRequests} from "../../services/employee/secretaryApi.ts";

export const PendingInternalRequestsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PagedResponse<InternalRequestDetails>, Error>({
        queryKey: ['internalRequests', 'PENDING', currentPage],
        queryFn: () => getInternalRequests('PENDING', currentPage, 10),
        placeholderData: keepPreviousData,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const requestList = data?._embedded?.internalRequestDetailsDtoList ?? [];

    return (
        <Container fluid className="p-4">
            <h1 className="mb-1">Solicitações Internas Pendentes</h1>
            <p className="lead text-muted">
                Lista de todas as solicitações internas que aguardam atendimento.
            </p>
            <hr className="my-4" />

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading && <div className="text-center p-5"><Spinner /></div>}
                    {isError && <Alert variant="danger">Erro ao carregar solicitações: {error.message}</Alert>}

                    {data && (
                        <>
                            <PendingRequestsTable requests={requestList} />
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