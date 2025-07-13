import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Building, Calendar, MapPin, BookOpenCheck } from 'lucide-react';
import type { TeacherCourseSection } from '../../../types';

export const CourseSectionCard = ({ section }: { section: TeacherCourseSection }) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="h-100">
            <Card className="h-100 shadow-sm">
                {section.hasNewActivity && (
                    <Badge pill bg="danger" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        Nova Atividade
                    </Badge>
                )}
                <Card.Body className="d-flex flex-column">
                    <Card.Title as="h5" style={{ fontFamily: 'Raleway, sans-serif' }}>{section.subjectName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{section.name}</Card.Subtitle>
                    <hr/>
                    <div className="d-flex align-items-center mb-2"><Building size={14} className="me-2 text-muted"/> {section.departmentName}</div>
                    <div className="d-flex align-items-center mb-2"><BookOpenCheck size={14} className="me-2 text-muted"/> {section.courseName}</div>
                    <div className="d-flex align-items-center mb-2"><Calendar size={14} className="me-2 text-muted"/> {section.academicTermName}</div>
                    <div className="d-flex align-items-center mb-2"><MapPin size={14} className="me-2 text-muted"/> Sala: {section.room}</div>
                    <div className="d-flex align-items-center"><Users size={14} className="me-2 text-muted"/> {section.studentCount} alunos</div>
                    <div className="mt-auto pt-3">
                        <Link to={`/my-classes/${section.id}`} className="btn btn-primary w-100">
                            Visualizar Turma
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};