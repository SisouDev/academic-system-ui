import React from 'react';
import { Container, Row, Col, Tabs, Tab, Card, Spinner, Alert } from 'react-bootstrap';
import { useProfile } from '../../hooks/profile/useProfile';
import { ProfileHeader } from '../../features/profile/components/ProfileHeader';
import { ProfileInfoCard } from '../../features/profile/components/ProfileInfoCard';
import { UpdateProfileForm } from '../../features/profile/components/UpdateProfileForm';
import { ChangePasswordForm } from '../../features/profile/components/ChangePasswordForm';

const ProfilePage: React.FC = () => {
    const { profile, isLoading, isError } = useProfile();

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    if (isError || !profile) {
        return <Alert variant="danger">Erro ao carregar o perfil do usuário.</Alert>;
    }

    return (
        <Container fluid="lg" className="py-4">
            <Row className="g-4">
                <Col xs={12}>
                    <ProfileHeader profile={profile} isEditable={true} />UserProfilePage.tsx
                </Col>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Tabs defaultActiveKey="overview" id="profile-tabs" className="mb-3">
                                <Tab eventKey="overview" title="Visão Geral">
                                    <ProfileInfoCard person={profile.person} />
                                </Tab>
                                <Tab eventKey="edit" title="Editar Perfil">
                                    <UpdateProfileForm
                                        currentUser={{ email: profile.person.email, phone: profile.person.phone || '' }}
                                    />
                                </Tab>
                                <Tab eventKey="security" title="Segurança">
                                    <ChangePasswordForm />
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;