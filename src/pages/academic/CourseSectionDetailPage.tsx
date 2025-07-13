import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Row, Col, Spinner, Table, Card } from 'react-bootstrap';
import api from '../../services/auth/api';
import { ActionCard } from '../../features/my-classes/components/ActionCard';
import type { CourseSectionDetailsForTeacher } from '../../types';
import {BookText, NotebookText, Star, ClipboardCheck, Megaphone, ListChecks, UserCircle} from 'lucide-react';

const getSectionDetails = async (sectionId?: string): Promise<CourseSectionDetailsForTeacher> => {
    if (!sectionId) throw new Error("ID da turma não fornecido.");
    const { data } = await api.get(`/api/v1/course-sections/${sectionId}/details-for-teacher`);
    return data;
};

export default function CourseSectionDetailPage() {
    const { id: sectionId } = useParams<{ id: string }>();

    const { data: details, isLoading, isError, error } = useQuery({
        queryKey: ['courseSectionDetails', sectionId],
        queryFn: () => getSectionDetails(sectionId),
        enabled: !!sectionId,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar detalhes da turma: {error.message}</Alert>;

    return (
        <div>
            <h1 className="mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>{details?.subjectName}</h1>
            <p className="lead text-muted">{details?.sectionName}</p>
            <hr/>
            <Row className="g-4 mt-1">
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Aulas e Conteúdos"
                        description="Visualize, crie e edite as aulas desta turma."
                        icon={NotebookText}
                        to={`/subjects/${details?.subjectId}`}
                        badgeContent={details?.lessonCount}
                        variant="primary"
                    />
                </Col>
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Plano de Aula"
                        description="Defina os objetivos e a bibliografia da disciplina."
                        icon={BookText}
                        to={`/lesson-plans/section/${sectionId}`}
                        variant="secondary"
                    />
                </Col>
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Notas e Avaliações"
                        description="Lance as notas e acompanhe o desempenho dos alunos."
                        icon={Star}
                        to={`/gradebook/section/${sectionId}`}
                        badgeContent={details?.pendingAssessmentsCount}
                        variant="success"
                    />
                </Col>
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Frequência"
                        description="Registre a presença e as faltas da turma."
                        icon={ClipboardCheck}
                        to={`/attendance/section/${sectionId}`}
                        variant="info"
                    />
                </Col>
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Avisos para a Turma"
                        description="Envie comunicados e avisos importantes."
                        icon={Megaphone}
                        to={`/announcements/section/${sectionId}`}
                        variant="warning"
                    />
                </Col>
                <Col md={6} lg={4}>
                    <ActionCard
                        title="Anotações do Professor"
                        description="Faça anotações particulares sobre os alunos."
                        icon={ListChecks}
                        to={`/teacher-notes/section/${sectionId}`}
                        variant="dark"
                    />
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Alunos Matriculados ({details?.studentCount || 0})</Card.Header>
                        <Card.Body>
                            <Table striped hover responsive>
                                <thead>
                                <tr>
                                    <th>Nome do Aluno</th>
                                    <th>Email</th>
                                    <th className="text-center">Média na Matéria</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details?.enrolledStudents && details.enrolledStudents.length > 0 ? (
                                    details.enrolledStudents.map(student => (
                                        <tr key={student.studentId}>
                                            <td>
                                                <UserCircle size={18} className="me-2 text-muted" />
                                                {student.studentName}
                                            </td>
                                            <td>{student.studentEmail}</td>
                                            <td className="text-center fw-bold">
                                                {student.averageGradeInSection?.toFixed(2) || '--'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center text-muted">Nenhum aluno matriculado nesta turma.</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}