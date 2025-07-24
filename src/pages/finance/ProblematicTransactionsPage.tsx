import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Container, Spinner, Alert, Pagination, Card } from 'react-bootstrap';
import type { PagedResponse, TransactionDetail } from '../../types';
import {getProblematicTransactions} from "../../services/employee/financeApi.ts";
import {ProblematicTransactionsTable} from "../../features/finance/ProblematicTransactionsTable.tsx";

export const ProblematicTransactionsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const {
        data,
        isLoading,
        isError,
        error,
        isPlaceholderData
    } = useQuery<PagedResponse<TransactionDetail>, Error>({
        queryKey: ['problematicTransactions', currentPage],
        queryFn: () => getProblematicTransactions(currentPage, 10),
        placeholderData: keepPreviousData,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const transactionList = data?._embedded ? Object.values(data._embedded)[0] : [];

    return (
        <Container fluid className="p-4">
            <h1 className="mb-1">Transações Problemáticas</h1>
            <p className="lead text-muted">
                Lista de transações com status pendente, falha ou em disputa.
            </p>
            <hr className="my-4" />

            <Card className="shadow-sm">
                <Card.Body>
                    {isLoading && (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Carregando...</p>
                        </div>
                    )}
                    {isError && <Alert variant="danger">Erro ao carregar transações: {error.message}</Alert>}

                    {data && (
                        <>
                            <ProblematicTransactionsTable transactions={transactionList} />
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(0)}
                                        disabled={currentPage === 0 || isPlaceholderData}
                                    />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0 || isPlaceholderData}
                                    />

                                    <Pagination.Item active>{currentPage + 1}</Pagination.Item>

                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= data.page.totalPages - 1 || isPlaceholderData}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(data.page.totalPages - 1)}
                                        disabled={currentPage >= data.page.totalPages - 1 || isPlaceholderData}
                                    />
                                </Pagination>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};