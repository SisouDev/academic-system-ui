import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { useUser } from '../../hooks/user/useUser';
import { ProfileHeader } from '../../features/profile/components/ProfileHeader';
import { ProfileInfoCard } from '../../features/profile/components/ProfileInfoCard';

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user, isLoading, isError } = useUser(userId);

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    if (isError || !user) {
        return <Alert variant="danger">Erro ao carregar o perfil do usuário.</Alert>;
    }

    return (
        <Container fluid="lg" className="py-4">
            <Row className="g-4">
                <Col xs={12}>
                    <ProfileHeader profile={user} isEditable={false} />
                </Col>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <ProfileInfoCard person={user.person} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;