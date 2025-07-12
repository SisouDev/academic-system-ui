import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import type { LoginCredentials } from '../../types';

import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const validationSchema = yup.object({
    login: yup.string().required('O campo login é obrigatório.'),
    password: yup.string().required('O campo senha é obrigatório.'),
}).required();

export const LoginForm = () => {
    const { signIn } = useAuthContext();
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
        setApiError(null);
        try {
            await signIn(data);
        } catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('Ocorreu um erro inesperado. Tente novamente.');
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="danger">{apiError}</Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="login">Login</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Text>
                        <User size={18} />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        id="login"
                        isInvalid={!!errors.login}
                        {...register('login')}
                        disabled={isSubmitting}
                        placeholder="seu.usuario"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.login?.message}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Senha</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Text>
                        <Lock size={18} />
                    </InputGroup.Text>
                    <Form.Control
                        type="password"
                        id="password"
                        isInvalid={!!errors.password}
                        {...register('password')}
                        disabled={isSubmitting}
                        placeholder="********"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <div className="d-grid mt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100">
                        {isSubmitting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                <span className="ms-2">Entrando...</span>
                            </>
                        ) : 'Entrar'}
                    </Button>
                </motion.div>
            </div>
        </Form>
    );
};