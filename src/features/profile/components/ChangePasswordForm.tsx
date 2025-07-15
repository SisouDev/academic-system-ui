import React from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type {ChangePasswordFormData} from '../../../types';
import { useProfile } from '../../../hooks/profile/useProfile.ts';

const schema = yup.object().shape({
    oldPassword: yup.string().required('Senha atual é obrigatória'),
    newPassword: yup
        .string()
        .required('Nova senha é obrigatória')
        .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'As senhas não conferem')
        .required('Confirmação da senha é obrigatória'),
});

export const ChangePasswordForm: React.FC = () => {
    const { changeUserPassword, isChangingPassword } = useProfile();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changeUserPassword(data, {
            onSuccess: () => reset(),
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h4>Alterar Senha</h4>
            <hr />
            <Row>
                <Col md={8}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                        <Form.Label>Senha Atual</Form.Label>
                        <Form.Control
                            type="password"
                            {...register('oldPassword')}
                            isInvalid={!!errors.oldPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.oldPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            {...register('newPassword')}
                            isInvalid={!!errors.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.newPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirmar Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            {...register('confirmPassword')}
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <Spinner as="span" size="sm" /> : 'Alterar Senha'}
            </Button>
        </Form>
    );
};