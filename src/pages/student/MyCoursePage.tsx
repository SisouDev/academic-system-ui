import { useQuery } from '@tanstack/react-query';
import { Container, Row, Col, Card, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { getMyCourseDetails } from '../../services/student/studentApi';
import { BookCopy, GraduationCap, CalendarDays, ClipboardCheck, Megaphone } from 'lucide-react';

import { CourseStructureTab } from '../../features/my-course/components/CourseStructureTab';
import { RecentLessonsTab } from '../../features/my-course/components/RecentLessonsTab';
import { AnnouncementsTab } from '../../features/my-course/components/AnnouncementsTab';
import { TeacherNotesTab } from '../../features/my-course/components/TeacherNotesTab';

const MyCoursePage = () => {
    const { data: course, isLoading, isError, error } = useQuery({
        queryKey: ['myCourseDetails'],
        queryFn: getMyCourseDetails,
    });

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" style={{ width: '3rem', height: '3rem' }}/></div>;
    }

    if (isError) {
        return <Container className="mt-4"><Alert variant="danger">Erro ao carregar dados do curso: {(error as Error).message}</Alert></Container>;
    }

    if (!course) {
        return <Container className="mt-4"><Alert variant="warning">Não foi possível encontrar os dados do seu curso.</Alert></Container>;
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <GraduationCap size={48} className="text-primary me-4 flex-shrink-0" />
                                <div>
                                    <h1 className="h3 mb-1" style={{fontFamily: 'Raleway, sans-serif'}}>{course.name}</h1>
                                    <p className="text-muted mb-0">{course.description}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="structure" id="my-course-tabs" className="mb-3 nav-pills" justify>
                <Tab eventKey="structure" title={<span className="d-flex align-items-center"><BookCopy size={16} className="me-2"/>Grade Curricular</span>}>
                    <Card className="p-3"><CourseStructureTab subjects={course.subjects} /></Card>
                </Tab>
                <Tab eventKey="lessons" title={<span className="d-flex align-items-center"><CalendarDays size={16} className="me-2"/>Mural de Aulas</span>}>
                    <Card className="p-3"><RecentLessonsTab /></Card>
                </Tab>
                <Tab eventKey="announcements" title={<span className="d-flex align-items-center"><Megaphone size={16} className="me-2"/>Mural de Avisos</span>}>
                    <Card className="p-3"><AnnouncementsTab /></Card>
                </Tab>
                <Tab eventKey="notes" title={<span className="d-flex align-items-center"><ClipboardCheck size={16} className="me-2"/>Anotações</span>}>
                    <Card className="p-3"><TeacherNotesTab /></Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default MyCoursePage;