import { Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import type { StudentDistributionData } from '../../../types';

export const StudentDistributionChart = ({ data }: { data: StudentDistributionData[] }) => {
    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title as="h5" className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Distribuição de Alunos por Curso
                </Card.Title>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="courseName"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid #ddd'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="studentCount"
                                fill="#EDAFB8"
                                name="Nº de Alunos"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card.Body>
        </Card>
    );
};