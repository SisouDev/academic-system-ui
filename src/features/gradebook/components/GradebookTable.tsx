import { Table, Card, Badge } from 'react-bootstrap';
import { GradeCell } from './GradeCell';
import type { GradebookData, GradebookStudent, AssessmentHeader } from '../../../types';

interface GradebookTableProps {
    gradebook: GradebookData;
    sectionId: string;
}

export const GradebookTable = ({ gradebook, sectionId }: GradebookTableProps) => {
    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th className="sticky-col align-middle">Aluno</th>
                        {gradebook.headers.map((header: AssessmentHeader) => (
                            <th key={header.definitionId} className="text-center">
                                <div className="fw-bold">{header.title}</div>
                                <div className="fw-normal small text-muted">{header.type}</div>
                                <div className="fw-light small text-muted">{new Date(header.date + 'T00:00:00').toLocaleDateString()}</div>
                                <Badge pill bg="secondary-subtle" text="dark">Peso: {header.weight}</Badge>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {gradebook.studentRows.map((student: GradebookStudent) => (
                        <tr key={student.studentId}>
                            <td className="sticky-col">{student.studentName}</td>
                            {gradebook.headers.map((header: AssessmentHeader) => (
                                <td key={`${student.studentId}-${header.definitionId}`} className="text-center p-1">
                                    <GradeCell student={student} header={header} sectionId={sectionId} />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};