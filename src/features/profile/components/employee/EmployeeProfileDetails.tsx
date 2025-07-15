import React from 'react';
import { Col } from 'react-bootstrap';
import { Award, CalendarPlus } from 'lucide-react';
import type {EmployeePersonDto} from '../../../../types';

interface Props {
    person: EmployeePersonDto;
}

export const EmployeeProfileDetails: React.FC<Props> = ({ person }) => (
    <>
        <Col md={6} className="d-flex align-items-center mt-3">
            <Award className="me-3" size={20} />
            <div>
                <strong>Cargo:</strong>
                <p className="mb-0 text-muted">{person.jobPosition}</p>
            </div>
        </Col>
        <Col md={6} className="d-flex align-items-center mt-3">
            <CalendarPlus className="me-3" size={20} />
            <div>
                <strong>Data de Contratação:</strong>
                <p className="mb-0 text-muted">{new Date(person.hiringDate).toLocaleDateString()}</p>
            </div>
        </Col>
    </>
);