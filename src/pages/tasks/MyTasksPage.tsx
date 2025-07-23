import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Row, Col, Card, Badge } from 'react-bootstrap';
import api from '../../services/auth/api';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import type { TaskSummaryTask, HateoasCollection } from '../../types';
import { formatTaskStatus } from '../../utils/requests/components/formatters.ts';

const getMyTasks = async (): Promise<TaskSummaryTask[]> => {
    const { data } = await api.get<HateoasCollection<TaskSummaryTask>>('/api/v1/tasks/my-tasks');

    if (!data || !data._embedded) {
        return [];
    }

    const embeddedKey = Object.keys(data._embedded)[0];
    return data._embedded[embeddedKey];
};

const TaskColumn = ({ title, tasks, statusColor }: { title: string, tasks: TaskSummaryTask[], statusColor: string }) => (
    <Col md={6} lg={3}>
        <h4 className="mb-3 text-center">
            <Badge bg={statusColor} className="w-100 py-2 fs-6">{title}</Badge>
        </h4>
        <div className="d-flex flex-column gap-3">
            {tasks.length > 0 ? tasks.map(task => (
                <Card key={task.id} className="shadow-sm">
                    <Card.Body>
                        <Card.Title>{task.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted small">
                            Vencimento: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
                        </Card.Subtitle>
                        <Card.Text className="small">
                            Para: <strong>{task.assigneeName}</strong> ({task.departmentName})
                        </Card.Text>
                        <Link to={`/tasks/${task.id}`} className="stretched-link" aria-label={`Ver detalhes da tarefa ${task.title}`}></Link>
                    </Card.Body>
                </Card>
            )) : <p className="text-center text-muted small mt-4">Nenhuma tarefa aqui.</p>}
        </div>
    </Col>
);

export default function MyTasksPage() {
    const { data: tasks, isLoading, isError, error } = useQuery({
        queryKey: ['myTasks'],
        queryFn: getMyTasks,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar tarefas: {(error as Error).message}</Alert>;

    const todoTasks = tasks?.filter(t => t.status === 'TODO') || [];
    const inProgressTasks = tasks?.filter(t => t.status === 'IN_PROGRESS') || [];
    const doneTasks = tasks?.filter(t => t.status === 'DONE') || [];
    const cancelledTasks = tasks?.filter(t => t.status === 'CANCELLED') || [];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Gerenciador de Tarefas</h1>
                <Link to="/tasks/new" className="btn btn-primary d-inline-flex align-items-center">
                    <PlusCircle size={18} className="me-2" />
                    Nova Tarefa
                </Link>
            </div>

            <Row>
                <TaskColumn title={formatTaskStatus('TODO')} tasks={todoTasks} statusColor="secondary" />
                <TaskColumn title={formatTaskStatus('IN_PROGRESS')} tasks={inProgressTasks} statusColor="info" />
                <TaskColumn title={formatTaskStatus('DONE')} tasks={doneTasks} statusColor="success" />
                <TaskColumn title={formatTaskStatus('CANCELLED')} tasks={cancelledTasks} statusColor="danger" />
            </Row>
        </div>
    );
}