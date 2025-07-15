import React, { useState } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import type {ProfileData} from '../../../types';
import { UploadAvatarModal } from './UploadAvatarModal.tsx';
import { Camera } from 'lucide-react';
import styles from './Profile.module.scss';

interface ProfileHeaderProps {
    profile: ProfileData;
    isEditable?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isEditable = false }) => {
    const [showModal, setShowModal] = useState(false);

    const fullName = `${profile.person.firstName} ${profile.person.lastName}`;
    const roles = profile.roles.map((role) => role.name.replace('ROLE_', '')).join(' | ');

    return (
        <>
            <Row className="align-items-center">
                <Col xs="auto" className={styles.avatarContainer}>
                    <Image
                        src={profile.person.profilePictureUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random`}
                        roundedCircle
                        fluid
                        className={styles.avatar}
                    />
                    {isEditable && (
                        <Button
                            variant="light"
                            className={styles.avatarEditButton}
                            onClick={() => setShowModal(true)}
                        >
                            <Camera size={18} />
                        </Button>
                    )}
                </Col>
                <Col>
                    <h2 className="mb-0">{fullName}</h2>
                    <p className="text-muted mb-0">{roles}</p>
                </Col>
            </Row>
            {isEditable && <UploadAvatarModal show={showModal} handleClose={() => setShowModal(false)} />}
        </>
    );
};