import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookUser, AlertTriangle } from 'lucide-react';
import type { EnrolledSubject } from '../../../../types/subject.types';

export const SubjectCard = ({ subject }: { subject: EnrolledSubject }) => {
    const getAbsenceVariant = (absences: number) => {
        if (absences > 5) return 'danger';
        if (absences > 2) return 'warning';
        return 'primary-subtle';
    };

    const getAbsenceTextColor = (absences: number) => {
        if (absences > 5) return 'white';
        if (absences > 2) return 'dark';
        return 'primary-emphasis';
    };

    return (
        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="h-100">
            <Card as={Link} to={`/subjects/${subject.subjectId}`} className="h-100 shadow-sm text-decoration-none text-body">
                <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title as="h5" style={{ fontFamily: 'Raleway, sans-serif' }} className="mb-0">
                            {subject.courseSectionInfo.subjectName}
                        </Card.Title>
                        <Badge
                            pill
                            bg={getAbsenceVariant(subject.totalAbsences)}
                            text={getAbsenceTextColor(subject.totalAbsences)}
                            className="d-flex align-items-center"
                        >
                            {subject.totalAbsences > 5 && <AlertTriangle size={12} className="me-1"/>}
                            Faltas: {subject.totalAbsences}
                        </Badge>
                    </div>
                    <Card.Subtitle className="mb-3 text-muted">{subject.courseSectionInfo.sectionName}</Card.Subtitle>
                    <div className="mt-auto d-flex align-items-center text-muted">
                        <BookUser size={16} className="me-2" />
                        <span>{subject.teacher.fullName}</span>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};