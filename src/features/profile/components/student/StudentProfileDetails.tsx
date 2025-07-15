import React from 'react';
import { Col } from 'react-bootstrap';
import { GraduationCap, BarChart2, CalendarOff } from 'lucide-react';
import type {StudentPersonDto} from '../../../../types';

interface Props {
    person: StudentPersonDto;
}

export const StudentProfileDetails: React.FC<Props> = ({ person }) => (
    <>
        <Col md={6} className="d-flex align-items-center mt-3">
            <GraduationCap className="me-3" size={20} />
            <div>
                <strong>Curso:</strong>
                <p className="mb-0 text-muted">{person.courseName}</p>
            </div>
        </Col>
        <Col md={6} className="d-flex align-items-center mt-3">
            <BarChart2 className="me-3" size={20} />
            <div>
                <strong>Média Geral:</strong>
                <p className="mb-0 text-muted">{person.generalAverage.toFixed(2)}</p>
            </div>
        </Col>
        <Col md={6} className="d-flex align-items-center mt-3">
            <CalendarOff className="me-3" size={20} />
            <div>
                <strong>Total de Faltas:</strong>
                <p className="mb-0 text-muted">{person.totalAbsences}</p>
            </div>
        </Col>
    </>
);