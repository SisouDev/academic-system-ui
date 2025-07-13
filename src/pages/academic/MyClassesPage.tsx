import { useQuery } from '@tanstack/react-query';
import { Alert, Row, Col, Spinner } from 'react-bootstrap';
import api from '../../services/auth/api';
import { CourseSectionCard } from '../../features/my-classes/components/CourseSectionCard';
import type { TeacherCourseSection, HateoasCollection } from '../../types';

const getMyClasses = async (): Promise<TeacherCourseSection[]> => {
    const { data } = await api.get<HateoasCollection<TeacherCourseSection>>('/api/v1/teachers/me/sections');

    const embeddedKey = Object.keys(data._embedded)[0];
    return data._embedded[embeddedKey];
};

export default function MyClassesPage() {
    const { data: sections, isLoading, isError, error } = useQuery({
        queryKey: ['myClasses'],
        queryFn: getMyClasses,
    });

    if (isLoading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar suas turmas: {error.message}</Alert>;
    }

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Minhas Turmas</h1>
            <p className="lead text-muted">Selecione uma turma para gerenciar o plano de aula, aulas, notas e mais.</p>
            <hr/>
            <Row className="g-4 mt-2">
                {sections && sections.length > 0 ? (
                    sections.map((section) => (
                        <Col key={section.id} md={6} lg={4} className="mb-4">
                            <CourseSectionCard section={section} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">Você não está lecionando em nenhuma turma ativa no momento.</Alert>
                    </Col>
                )}
            </Row>
        </div>
    );
}