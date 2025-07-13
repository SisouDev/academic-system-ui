import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Spinner } from 'react-bootstrap';
import api from '../../../services/auth/api';
import type { GradebookStudent, AssessmentHeader } from '../../../types';

type SaveGradeRequest = {
    isNew: boolean;
    assessmentId: number | null;
    enrollmentId: number;
    assessmentDefinitionId: number;
    score: number | null;
}

interface GradeCellProps {
    student: GradebookStudent;
    header: AssessmentHeader;
    sectionId: string;
}

const saveGradeRequest = ({ isNew, ...data }: SaveGradeRequest) => {
    if (isNew) {
        return api.post('/api/v1/assessments', data);
    }
    return api.put(`/api/v1/assessments/${data.assessmentId}`, { score: data.score });
};

export const GradeCell = ({ student, header, sectionId }: GradeCellProps) => {
    const queryClient = useQueryClient();
    const gradeData = student.grades[header.definitionId] || { assessmentId: null, score: null };

    const [score, setScore] = useState<string | number>(gradeData.score ?? '');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: saveGradeRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['gradebook', sectionId] });
        }
    });

    useEffect(() => {
        setScore(gradeData.score ?? '');
    }, [gradeData.score]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        setIsEditing(false);
        const currentScore = gradeData.score ?? '';
        if (String(score) === String(currentScore)) return;

        mutate({
            isNew: !gradeData.assessmentId,
            assessmentId: gradeData.assessmentId,
            enrollmentId: student.enrollmentId,
            assessmentDefinitionId: header.definitionId,
            score: score === '' ? null : Number(score),
        });
    };

    if (isEditing) {
        return (
            <Form.Control
                ref={inputRef}
                type="number"
                size="sm"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                disabled={isPending}
                style={{ width: '80px', margin: 'auto' }}
            />
        );
    }

    return (
        <div onClick={() => setIsEditing(true)} style={{ minHeight: '38px', cursor: 'pointer' }} className="d-flex align-items-center justify-content-center">
            {isPending ? <Spinner size="sm" /> : <strong>{score}</strong>}
        </div>
    );
};