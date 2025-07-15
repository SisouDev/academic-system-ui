import React from 'react';
import { Col } from 'react-bootstrap';
import { Briefcase, BookCopy } from 'lucide-react';
import type {TeacherPersonDto} from '../../../../types';

interface Props {
    person: TeacherPersonDto;
}

export const TeacherProfileDetails: React.FC<Props> = ({ person }) => (
    <>
        <Col md={6} className="d-flex align-items-center mt-3">
            <Briefcase className="me-3" size={20} />
            <div>
                <strong>Formação Acadêmica:</strong>
                <p className="mb-0 text-muted">{person.academicBackground}</p>
            </div>
        </Col>
        <Col md={6} className="d-flex align-items-center mt-3">
            <BookCopy className="me-3" size={20} />
            <div>
                <strong>Turmas Ativas:</strong>
                <p className="mb-0 text-muted">{person.totalActiveSections}</p>
            </div>
        </Col>
    </>
);