import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Container, Spinner, Alert, Pagination, Card } from 'react-bootstrap';

import type { PagedResponse, LeaveRequestDetails } from '../../types';
import {LeaveRequestsTable} from "../../features/hr/LeaveRequestsTable.tsx";
import {getLeaveRequests} from "../../services/employee/hrApi.ts";

export const PendingLeaveRequestsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PagedResponse<LeaveRequestDetails>, Error>({
        queryKey: ['leaveRequests', 'PENDING', currentPage],
        queryFn: () => getLeaveRequests('PENDING', currentPage, 10),
        placeholderData: keepPreviousData,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const requestList = data?._embedded?.leaveRequestDetailsDtoList ?? [];

    return (
        <Container fluid className="p-4">
            <h1 className="mb-1">Pedidos de Afastamento Pendentes</h1>
            <p className="lead text-muted">
                Lista de todos os pedidos de afastamento que aguardam aprovação.
            </p>
            <hr className="my-4" />

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>}
                    {isError && <Alert variant="danger">Erro ao carregar os pedidos: {error.message}</Alert>}

                    {data && (
                        <>
                            <LeaveRequestsTable requests={requestList} />
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