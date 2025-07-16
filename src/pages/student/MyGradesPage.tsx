import { useQuery } from '@tanstack/react-query';
import { getMyEnrollments, getEnrollmentDetails, getAssessmentDefinitions } from '../../services/student/studentApi';
import { Container, Accordion, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
import type { EnrollmentDetails, Assessment, AssessmentDefinition } from '../../types';
import { BookCheck } from 'lucide-react';

const GradeDetails = ({ enrollmentId, courseSectionId }: { enrollmentId: number, courseSectionId: number }) => {
    const {
        data: details,
        isLoading: isLoadingDetails,
        isError: isErrorDetails,
        error: errorDetails
    } = useQuery<EnrollmentDetails, Error>({
        queryKey: ['enrollmentDetails', enrollmentId],
        queryFn: () => getEnrollmentDetails(enrollmentId),
    });

    const {
        data: definitions,
        isLoading: isLoadingDefinitions,
        isError: isErrorDefinitions,
        error: errorDefinitions
    } = useQuery<AssessmentDefinition[], Error>({
        queryKey: ['assessmentDefinitions', courseSectionId],
        queryFn: () => getAssessmentDefinitions(courseSectionId),
        enabled: !!details,
    });

    if (isLoadingDetails || isLoadingDefinitions) {
        return <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>;
    }

    if (isErrorDetails) return <Alert variant="danger" className="m-0">Erro ao carregar notas: {errorDetails.message}</Alert>;
    if (isErrorDefinitions) return <Alert variant="danger" className="m-0">Erro ao carregar pesos: {errorDefinitions.message}</Alert>;


    if (!details || !definitions) {
        return <Alert variant="warning" className="m-0">Dados da disciplina indisponíveis no momento.</Alert>;
    }

    const assessmentsWithWeights = details.assessments.map(assessment => {
        const definition = definitions.find(def => def.id === assessment.assessmentDefinitionId);

        const displayTitle = definition?.title || 'Avaliação';

        return { ...assessment, title: displayTitle, weight: definition?.weight || 0 };
    });

    const calculateFinalGrade = (assessments: (Assessment & { weight: number })[]): { grade: number, totalWeight: number } => {
        const totalScore = assessments.reduce((acc, curr) => {
            if (curr.score !== null && curr.weight > 0) {
                return acc + curr.score * (curr.weight / 100);
            }
            return acc;
        }, 0);

        const totalWeight = assessments.reduce((acc, curr) => {
            if (curr.score !== null && curr.weight > 0) {
                return acc + (curr.weight / 100);
            }
            return acc;
        }, 0);

        return {
            grade: totalWeight > 0 ? totalScore : 0,
            totalWeight: totalWeight
        };
    };

    const { grade: finalGrade, totalWeight } = calculateFinalGrade(assessmentsWithWeights);
    const approvalStatus = finalGrade >= 7 ? "Aprovado" : (finalGrade >= 5 ? "Recuperação" : "Reprovado");

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <strong>Média Final: {finalGrade.toFixed(2)}</strong>
                    <span className={`ms-2 p-1 badge bg-${finalGrade >= 7 ? 'success' : (finalGrade >= 5 ? 'warning' : 'danger')}-subtle text-${finalGrade >= 7 ? 'success' : (finalGrade >= 5 ? 'warning' : 'danger')}-emphasis`}>
                        {approvalStatus}
                    </span>
                </div>
                <small className="text-muted">Peso Total Calculado: {Math.round(totalWeight * 100)}%</small>
            </div>
            <ProgressBar
                now={finalGrade * 10}
                label={`${finalGrade.toFixed(2)}`}
                variant={finalGrade >= 7 ? 'success' : (finalGrade >= 5 ? 'warning' : 'danger')}
                style={{height: '25px'}}
                className="mb-4 fw-bold"
            />
            <Table striped bordered hover responsive size="sm">
                <thead>
                <tr>
                    <th>Avaliação</th>
                    <th>Tipo</th>
                    <th>Peso</th>
                    <th>Nota</th>
                </tr>
                </thead>
                <tbody>
                {assessmentsWithWeights.map(item => (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td><Badge pill bg="primary-subtle" text="primary-emphasis">{item.type}</Badge></td>
                        <td>{item.weight.toFixed(0)}%</td>
                        <td><strong>{item.score?.toFixed(2) ?? 'N/L'}</strong></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};

const MyGradesPage = () => {
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
            <h1 className="mb-4">Minhas Notas</h1>
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
                                <GradeDetails enrollmentId={enrollment.id} courseSectionId={enrollment.courseSectionInfo.id} />
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

export default MyGradesPage;