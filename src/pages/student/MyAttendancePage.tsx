import { useQuery } from '@tanstack/react-query';
import { getMyEnrollments, getEnrollmentDetails } from '../../services/student/studentApi';
import { Container, Accordion, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import type { EnrollmentDetails } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {BookCheck, CalendarCheck, CalendarX} from 'lucide-react';

const AttendanceDetails = ({ enrollmentId }: { enrollmentId: number }) => {
    const { data: details, isLoading, isError, error } = useQuery<EnrollmentDetails, Error>({
        queryKey: ['enrollmentDetails', enrollmentId],
        queryFn: () => getEnrollmentDetails(enrollmentId),
    });

    if (isLoading) return <Spinner animation="border" size="sm" />;
    if (isError) return <Alert variant="danger" className="m-0">Erro ao carregar detalhes: {error.message}</Alert>;
    if (!details) return <Alert variant="warning" className="m-0">Não foi possível encontrar os detalhes da matrícula.</Alert>;


    const totalLessons = details.attendanceRecords.length;
    const totalAbsences = details.attendanceRecords.filter(r => !r.wasPresent).length;
    const attendanceRate = totalLessons > 0 ? ((totalLessons - totalAbsences) / totalLessons) * 100 : 100;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="info-subtle" text="info-emphasis" className="p-2 fs-6">
                    Frequência: {attendanceRate.toFixed(1)}%
                </Badge>
                <Badge bg="danger-subtle" text="danger-emphasis" className="p-2 fs-6">
                    Total de Faltas: {totalAbsences}
                </Badge>
            </div>
            <Table striped bordered hover responsive size="sm">
                <thead>
                <tr>
                    <th>Data da Aula</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {details.attendanceRecords.map(record => (
                    <tr key={record.id}>
                        <td>{format(new Date(record.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</td>
                        <td>
                            {record.wasPresent ? (
                                <Badge pill bg="success-subtle" text="success-emphasis" className="d-flex align-items-center" style={{width: 'fit-content'}}>
                                    <CalendarCheck size={16} className="me-1"/> Presente
                                </Badge>
                            ) : (
                                <Badge pill bg="danger-subtle" text="danger-emphasis" className="d-flex align-items-center" style={{width: 'fit-content'}}>
                                    <CalendarX size={16} className="me-1"/> Falta
                                </Badge>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

const MyAttendancePage = () => {
    const { data: enrollments, isLoading, isError, error } = useQuery({
        queryKey: ['myEnrollments'],
        queryFn: getMyEnrollments,
    });

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao buscar suas disciplinas: {error.message}</Alert>;
    }

    return (
        <Container>
            <h1 className="mb-4">Minha Frequência</h1>
            {enrollments && enrollments.length > 0 ? (
                <Accordion>
                    {enrollments.map((enrollment, index) => (
                        <Accordion.Item eventKey={String(index)} key={enrollment.id}>
                            <Accordion.Header>
                                <div className='d-flex justify-content-between w-100 align-items-center pe-3'>
                                    <strong>{enrollment.courseSectionInfo.subjectName}</strong>
                                    <span className="text-muted">{enrollment.courseSectionInfo.sectionName}</span>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <AttendanceDetails enrollmentId={enrollment.id} />
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <Alert variant="info" className="text-center">
                    <BookCheck size={40} className="mb-2"/>
                    <p className="mb-0">Você ainda não está matriculado em nenhuma disciplina.</p>
                </Alert>
            )}
        </Container>
    );
};

export default MyAttendancePage;