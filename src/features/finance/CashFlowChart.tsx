import { Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type {CashFlowTrend} from "../../types";


interface CashFlowChartProps {
    data: CashFlowTrend[];
    isPrinting?: boolean;
}

export const CashFlowChart = ({ data, isPrinting = false }: CashFlowChartProps) => (
    <Card className="shadow-sm h-100">
        <Card.Body>
            <Card.Title>Fluxo de Caixa Mensal (Últimos 6 Meses)</Card.Title>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Receitas" fill="#28a745" isAnimationActive={!isPrinting} />
                    <Bar dataKey="expenses" name="Despesas" fill="#dc3545" isAnimationActive={!isPrinting} />
                </BarChart>
            </ResponsiveContainer>
        </Card.Body>
    </Card>
);