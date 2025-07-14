import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Card, Table } from 'react-bootstrap';
import api from '../../services/auth/api';
import { Link } from 'react-router-dom';
import { NotebookPen } from 'lucide-react';
import type { TeacherStudent, HateoasCollection } from '../../types';

const getAllMyStudents = async (): Promise<TeacherStudent[]> => {
    const { data } = await api.get<HateoasCollection<TeacherStudent>>('/api/v1/teachers/me/students');

    const embeddedKey = Object.keys(data._embedded)[0];
    return data._embedded[embeddedKey];
};

export default function AllMyStudentsPage() {
    const { data: students, isLoading, isError, error } = useQuery({
        queryKey: ['allMyStudents'],
        queryFn: getAllMyStudents,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar lista de alunos: {(error as Error).message}</Alert>;

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Meus Alunos</h1>
            <Card className="shadow-sm">
                <Table striped hover responsive className="mb-0">
                    <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>Email</th>
                        <th>Curso</th>
                        <th>Disciplina</th>
                        <th className="text-center">Média</th>
                        <th className="text-end">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students && students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.enrollmentId}>
                                <td>{student.studentName}</td>
                                <td>{student.studentEmail}</td>
                                <td>{student.courseName}</td>
                                <td>{student.subjectName}</td>
                                <td className="text-center fw-bold">{student.averageGrade?.toFixed(2) || '--'}</td>
                                <td className="text-end">
                                    <Link to={`/teacher-notes/enrollment/${student.enrollmentId}`} className="btn btn-sm btn-outline-secondary">
                                        <NotebookPen size={16} /> Anotações
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center text-muted py-4">Nenhum aluno encontrado em suas turmas ativas.</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}