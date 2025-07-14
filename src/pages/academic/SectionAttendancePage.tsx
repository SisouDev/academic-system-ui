import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner, Card, Table, Button, ButtonGroup } from 'react-bootstrap';
import api from '../../services/auth/api';
import { Check, X } from 'lucide-react';
import type {ClassListStudentAtt, HateoasCollection} from '../../types';

const getClassList = async (sectionId?: string): Promise<ClassListStudentAtt[]> => {
    if (!sectionId) return [];

    const { data } = await api.get<HateoasCollection<ClassListStudentAtt>>(`/api/v1/enrollments/section/${sectionId}/class-list`);
    const embeddedKey = Object.keys(data._embedded)[0];
    return data._embedded[embeddedKey];
};

const recordAttendanceRequest = (data: { enrollmentId: number; wasPresent: boolean }) => {
    return api.post('/api/v1/enrollments/attendance', data);
};

const StudentAttendanceRow = ({ student, sectionId }: { student: ClassListStudentAtt, sectionId: string }) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: recordAttendanceRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classList', sectionId] });
        }
    });

    const handleSetAttendance = (wasPresent: boolean) => {
        const currentStatus = student.todaysStatus;
        if ((wasPresent && currentStatus === 'PRESENT') || (!wasPresent && currentStatus === 'ABSENT')) {
            return;
        }
        mutate({ enrollmentId: student.enrollmentId, wasPresent });
    };

    return (
        <tr>
            <td>{student.studentName}</td>
            <td>{student.studentEmail}</td>
            <td className="text-center">
                <ButtonGroup>
                    <Button
                        variant={student.todaysStatus === 'PRESENT' ? 'success' : 'outline-success'}
                        onClick={() => handleSetAttendance(true)}
                        disabled={isPending}
                    >
                        <Check size={18} /> Presente
                    </Button>
                    <Button
                        variant={student.todaysStatus === 'ABSENT' ? 'danger' : 'outline-danger'}
                        onClick={() => handleSetAttendance(false)}
                        disabled={isPending}
                    >
                        <X size={18} /> Ausente
                    </Button>
                </ButtonGroup>
                {isPending && <Spinner size="sm" className="ms-2" />}
            </td>
        </tr>
    );
};

export default function SectionAttendancePage() {
    const { sectionId } = useParams<{ sectionId: string }>();

    const { data: students, isLoading, isError, error } = useQuery({
        queryKey: ['classList', sectionId],
        queryFn: () => getClassList(sectionId),
        enabled: !!sectionId,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar a lista de chamada: {(error as Error).message}</Alert>;

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Registro de Frequência</h1>
            <p className="text-muted">Marque a presença ou falta dos alunos para a aula de hoje ({new Date().toLocaleDateString()}).</p>
            <Card className="shadow-sm mt-4">
                <Table striped hover responsive className="mb-0">
                    <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>Email</th>
                        <th className="text-center">Status da Presença</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students && students.length > 0 ? (
                        students.map((student) => (
                            <StudentAttendanceRow key={student.enrollmentId} student={student} sectionId={sectionId!} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center text-muted py-4">Nenhum aluno matriculado nesta turma.</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}