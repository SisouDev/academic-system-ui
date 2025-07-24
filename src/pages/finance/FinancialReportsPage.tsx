import { useQuery } from '@tanstack/react-query';
import {Container, Row, Col, Spinner, Alert, Button} from 'react-bootstrap';
import {DollarSign, TrendingUp, TrendingDown, Activity, Download} from 'lucide-react';
import {getDirectorFinancialReport} from "../../services/employee/financeApi.ts";
import {KPI} from "../../features/common/KPI.tsx";
import {CashFlowChart} from "../../features/finance/CashFlowChart.tsx";
import {ExpenseChart} from "../../features/finance/ExpenseChart.tsx";
import {useState} from "react";
import {exportToPdf} from "../../services/common/pdfExporter.ts";


export const FinancialReportsPage = () => {
    const [isExporting, setIsExporting] = useState(false);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['directorFinancialReport'],
        queryFn: getDirectorFinancialReport,
    });

    const handleExport = async () => {
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 100));

        await exportToPdf('financialReport', 'relatorio-financeiro.pdf');

        setIsExporting(false);
    };



    if (isLoading) {
        return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar relatórios financeiros: {(error as Error).message}</Alert>;
    }

    if (!data) {
        return <Alert variant="warning">Não foram encontrados dados para os relatórios.</Alert>;
    }

    const { overview, cashFlowTrend, expenseBreakdown } = data;

    return (
        <Container fluid className="p-4">
            <div id="financialReport">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="mb-1">Relatórios Financeiros Estratégicos</h1>
                        <p className="lead text-muted">Análise consolidada da saúde financeira da instituição.</p>
                    </div>
                    <Button
                        variant="outline-primary"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="no-print"
                    >
                        {isExporting ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            <Download size={18} className="me-2" />
                        )}
                        {isExporting ? 'Gerando...' : 'Exportar para PDF'}
                    </Button>
                </div>
            </div>
            <hr className="my-4" />

            <Row className="g-4">
                <KPI title="Receita Total (Ano)" value={overview.totalRevenueYTD} prefix="R$ " icon={TrendingUp} color="#28a745" />
                <KPI title="Despesa Total (Ano)" value={overview.totalExpensesYTD} prefix="R$ " icon={TrendingDown} color="#dc3545" />
                <KPI title="Resultado Líquido (Ano)" value={overview.netIncomeYTD} prefix="R$ " icon={DollarSign} color="#007bff" />
                <KPI title="Margem de Lucro" value={overview.profitMargin} suffix=" %" icon={Activity} color="#ffc107" />

                <Col lg={7} className="mt-5">
                    <CashFlowChart data={cashFlowTrend} isPrinting={isExporting} />
                </Col>
                <Col lg={5} className="mt-5">
                    <ExpenseChart data={expenseBreakdown} isPrinting={isExporting} />
                </Col>
            </Row>
        </Container>
    );
};