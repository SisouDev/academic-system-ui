import { useQuery } from '@tanstack/react-query';
import { Alert, Row, Col, Spinner } from 'react-bootstrap';
import api from '../../services/auth/api';
import { SubjectCard } from '../../features/dashboard/subjects/components/SubjectCard';
import type { EnrolledSubject, HateoasResponse } from '../../types';

const getMySubjects = async (): Promise<EnrolledSubject[]> => {
    const { data } = await api.get<HateoasResponse<EnrolledSubject>>('/api/v1/students/me/enrollments');

    const embeddedKey = Object.keys(data._embedded)[0];
    return data._embedded[embeddedKey];
};

export default function MySubjectsPage() {
    const { data: subjects, isLoading, isError, error } = useQuery({
        queryKey: ['mySubjects'],
        queryFn: getMySubjects,
    });

    if (isLoading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar suas matérias: {error.message}</Alert>;
    }

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Minhas Matérias</h1>
            <Row className="g-4">
                {subjects && subjects.length > 0 ? (
                    subjects.map((subject: EnrolledSubject) => (
                        <Col key={subject.id} md={6} lg={4}>
                            <SubjectCard subject={subject} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">Você não está matriculado em nenhuma matéria no momento.</Alert>
                    </Col>
                )}
            </Row>
        </div>
    );
}