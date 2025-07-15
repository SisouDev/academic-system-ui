import React from 'react';
import { Row, Col } from 'react-bootstrap';
import type {PersonResponseDto } from '../../../types';
import { Mail, Phone, Calendar, Info } from 'lucide-react';
import {StudentProfileDetails} from "./student/StudentProfileDetails.tsx";
import {TeacherProfileDetails} from "./teacher/TeacherProfileDetails.tsx";
import {EmployeeProfileDetails} from "./employee/EmployeeProfileDetails.tsx";

interface ProfileInfoCardProps {
    person: PersonResponseDto ;
}

const renderSpecificDetails = (person: PersonResponseDto ) => {
    switch (person.personType) {
        case 'STUDENT':
            return <StudentProfileDetails person={person} />;
        case 'TEACHER':
            return <TeacherProfileDetails person={person} />;
        case 'EMPLOYEE':
            return <EmployeeProfileDetails person={person} />;
        default:
            return null;
    }
};

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ person }) => {
    return (
        <>
            <h4>Detalhes do Perfil</h4>
            <hr />
            <Row className="g-3">
                {/* Detalhes Comuns */}
                <Col md={6} className="d-flex align-items-center">
                    <Mail className="me-3" size={20} />
                    <div>
                        <strong>Email:</strong>
                        <p className="mb-0 text-muted">{person.email}</p>
                    </div>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <Phone className="me-3" size={20} />
                    <div>
                        <strong>Telefone:</strong>
                        <p className="mb-0 text-muted">{person.phone || 'Não informado'}</p>
                    </div>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <Calendar className="me-3" size={20} />
                    <div>
                        <strong>Membro desde:</strong>
                        <p className="mb-0 text-muted">{new Date(person.createdAt).toLocaleDateString()}</p>
                    </div>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <Info className="me-3" size={20} />
                    <div>
                        <strong>Status:</strong>
                        <p className="mb-0 text-muted">{person.status}</p>
                    </div>
                </Col>

                <Col xs={12}><hr className="my-3" /></Col>

                {renderSpecificDetails(person)}
            </Row>
        </>
    );
};