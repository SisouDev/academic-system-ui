import { useQuery } from '@tanstack/react-query';
import {Alert, Row, Col, Spinner, Card, Badge} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import api from '../../services/auth/api';

type TeacherCourseSection = {
    id: number;
    subjectId: number;
    name: string;
    subjectName: string;
    courseName: string;
    totalLessons: number;
};

const getMyCourseSections = async (): Promise<TeacherCourseSection[]> => {
    const { data } = await api.get('/api/v1/teachers/my-sections');
    return data;
};

export default function LessonPlansPage() {
    const { data: sections, isLoading, isError, error } = useQuery({
        queryKey: ['myCourseSectionsForLessons'],
        queryFn: getMyCourseSections,
    });

    if (isLoading) {
        return <div className="text-center p-5"><Spinner /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar suas turmas: {error.message}</Alert>;
    }

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Gerenciar Planos de Aula</h1>
            <p className="lead text-muted">Selecione uma turma para visualizar, adicionar ou editar as aulas e seus conteúdos.</p>
            <hr />

            <Row className="g-4 mt-3">
                {sections && sections.length > 0 ? (
                    sections.map((section: TeacherCourseSection) => (
                        <Col key={section.id} md={6} lg={4}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title as="h5" style={{ fontFamily: 'Raleway, sans-serif' }}>{section.subjectName}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{section.name}</Card.Subtitle>
                                    <Card.Text className="mt-auto">
                                        <Badge bg="secondary-subtle" text="dark" className="me-2">{section.courseName}</Badge>
                                        <Badge bg="primary-subtle" text="primary-emphasis">{section.totalLessons} aulas criadas</Badge>
                                    </Card.Text>
                                    <Link
                                        to={`/subjects/${section.subjectId}`}
                                        className="btn btn-primary mt-3 d-flex align-items-center justify-content-center"
                                    >
                                        <BookMarked size={16} className="me-2" />
                                        Gerenciar Aulas
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">Você não possui turmas ativas para gerenciar.</Alert>
                    </Col>
                )}
            </Row>
        </div>
    );
}