import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useProfile } from '../../../hooks/profile/useProfile.ts';

interface UploadAvatarModalProps {
    show: boolean;
    handleClose: () => void;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({ show, handleClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { updateAvatar, isUpdatingAvatar } = useProfile();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedFile) {
            updateAvatar(selectedFile, {
                onSuccess: () => {
                    handleClose();
                    setSelectedFile(null);
                },
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Alterar Foto de Perfil</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Selecione uma imagem</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isUpdatingAvatar}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={!selectedFile || isUpdatingAvatar}>
                        {isUpdatingAvatar ? <Spinner as="span" size="sm" /> : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};