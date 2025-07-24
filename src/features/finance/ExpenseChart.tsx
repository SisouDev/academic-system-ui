import { Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type {ExpenseBreakdown} from "../../types";


interface ExpenseChartProps {
    data: ExpenseBreakdown[];
    isPrinting?: boolean;
}

const COLORS = ['#dc3545', '#ffc107', '#007bff', '#17a2b8'];

const renderCustomizedLabel = ({ name, percent }: { name: string, percent?: number }) => {
    if (!percent) return name;
    return `${(percent * 100).toFixed(0)}%`;
};

export const ExpenseChart = ({ data, isPrinting = false }: ExpenseChartProps) => (
    <Card className="shadow-sm h-100">
        <Card.Body>
            <Card.Title>Composição das Despesas (Ano)</Card.Title>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="totalAmount"
                        nameKey="category"
                        label={renderCustomizedLabel}
                        isAnimationActive={!isPrinting}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card.Body>
    </Card>
);