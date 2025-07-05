import React, {useEffect, useRef, useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import UIkit from 'uikit';

type EnrolledStudent = {
    id: number;
    studentName: string;
};

type AttendanceStatus = 'PRESENT' | 'ABSENT';
type AttendancePayload = {
    enrollmentId: number;
    date: string;
    wasPresent: boolean;
};

interface AttendanceModalProps {
    students: EnrolledStudent[];
    onClose: () => void;
}

const recordAttendanceRequest = async (payload: AttendancePayload) => {
    await api.post('/api/v1/enrollments/attendance', payload);
};

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ students, onClose }) => {
    const queryClient = useQueryClient();
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
    const modalRef = useRef<HTMLDivElement>(null);

    const { mutateAsync: recordAttendance, isPending } = useMutation({
        mutationFn: recordAttendanceRequest,
        onError: (_err, variables) => {
            const studentName = students.find(s => s.id === variables.enrollmentId)?.studentName;
            toast.error(`Erro ao salvar frequência para ${studentName || 'um aluno'}.`);
        },
    });

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            UIkit.util.on(modalElement, 'beforehide', onClose);
            return () => {
                UIkit.util.off(modalElement, 'beforehide', onClose);
            };
        }
    }, [onClose]);

    const handleStatusChange = (enrollmentId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [enrollmentId]: status }));
    };

    const handleSaveAll = async () => {
        const today = new Date().toISOString().split('T')[0];
        const promises = Object.entries(attendance).map(([enrollmentId, status]) => {
            const payload: AttendancePayload = {
                enrollmentId: Number(enrollmentId),
                date: today,
                wasPresent: status === 'PRESENT',
            };
            return recordAttendance(payload);
        });

        try {
            await Promise.all(promises);
            toast.success("Frequência de hoje salva com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] });
            UIkit.modal(modalRef.current!).hide();
        } catch (error) {
            console.error("Uma ou mais chamadas de frequência falharam.", error);
        }
    };

    return (
        <div id="attendance-modal" data-uk-modal ref={modalRef}>
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Registrar Frequência - {new Date().toLocaleDateString()}</h2>
                </div>
                <div className="uk-modal-body" data-uk-overflow-auto>
                    <table className="uk-table uk-table-divider uk-table-middle">
                        <thead>
                        <tr>
                            <th>Aluno</th>
                            <th className="uk-text-center" style={{ width: '150px' }}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.studentName}</td>
                                <td className="uk-text-center">
                                    <div className="uk-button-group">
                                        <button
                                            type="button"
                                            className={`uk-button uk-button-small ${attendance[student.id] === 'PRESENT' ? 'uk-button-primary' : 'uk-button-default'}`}
                                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                        >
                                            Presente
                                        </button>
                                        <button
                                            type="button"
                                            className={`uk-button uk-button-small ${attendance[student.id] === 'ABSENT' ? 'uk-button-danger' : 'uk-button-default'}`}
                                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                        >
                                            Ausente
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">Cancelar</button>
                    <button
                        className="uk-button uk-button-primary"
                        type="button"
                        onClick={handleSaveAll}
                        disabled={isPending}
                    >
                        {isPending ? <div data-uk-spinner="ratio: 0.6"></div> : 'Salvar Frequência'}
                    </button>
                </div>
            </div>
        </div>
    );
};