import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../../services/api.ts';

type ChartData = {
    courseName: string;
    studentCount: number;
};

const fetchDistributionData = async (): Promise<ChartData[]> => {
    const response = await api.get('/api/v1/admin/stats/student-distribution');
    return response.data;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4f'];

export function StudentDistributionChart() {
    const { data, isLoading, isError } = useQuery<ChartData[], Error>({
        queryKey: ['studentDistribution'],
        queryFn: fetchDistributionData,
    });

    console.log('Dados para o gráfico:', data);
    if (isLoading) return <div className="uk-text-center"><div data-uk-spinner></div></div>;
    if (isError) return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar dados do gráfico.</p></div>;
    if (!data || data.length === 0) {
        console.log("Renderizando: Nenhum dado de aluno encontrado.");
        return <p className="uk-text-center uk-text-muted">Nenhum dado de aluno encontrado para exibir.</p>;
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '450px', maxWidth: '700px', margin: '0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="studentCount"
                        nameKey="courseName"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => {
                            if (!percent || percent < 0.05) return '';
                            return `${name} ${(percent * 100).toFixed(0)}%`;
                        }}
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} alunos`, name]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}