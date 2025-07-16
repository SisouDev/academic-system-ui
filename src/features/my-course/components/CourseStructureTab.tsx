import type { CourseSubject } from '../../../types';
import { Accordion } from 'react-bootstrap';

interface CourseStructureTabProps {
    subjects: CourseSubject[];
}

export const CourseStructureTab = ({ subjects }: CourseStructureTabProps) => {
    const semesters = [...new Set(subjects.map(s => s.semester))].sort((a, b) => a - b);

    return (
        <Accordion defaultActiveKey="0" flush>
            {semesters.map((semester, index) => (
                <Accordion.Item eventKey={String(index)} key={semester}>
                    <Accordion.Header>{semester}º Semestre</Accordion.Header>
                    <Accordion.Body>
                        <ul className="list-group list-group-flush">
                            {subjects
                                .filter(s => s.semester === semester)
                                .map(subject => (
                                    <li key={subject.subjectId} className="list-group-item">
                                        {subject.subjectName}
                                    </li>
                                ))
                            }
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};