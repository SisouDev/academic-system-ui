import React, { useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type {UpdateProfileFormData} from '../../../types';
import { useProfile } from '../../../hooks/profile/useProfile.ts';

const schema = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
});

interface UpdateProfileFormProps {
    currentUser: { email: string; phone: string };
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ currentUser }) => {
    const { updateUserProfile, isUpdatingProfile } = useProfile();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateProfileFormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        reset(currentUser);
    }, [currentUser, reset]);

    const onSubmit = (data: UpdateProfileFormData) => {
        updateUserProfile(data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h4>Editar Informações</h4>
            <hr />
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type="text" {...register('phone')} isInvalid={!!errors.phone} />
                        <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? <Spinner as="span" size="sm" /> : 'Salvar Alterações'}
            </Button>
        </Form>
    );
};