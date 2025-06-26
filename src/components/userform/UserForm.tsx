// src/components/UserForm/UserForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {type UserFormData, userFormSchema } from './userFormSchema';
import { Input } from '../input';
import { Button } from '../button';
import { User, Mail, Briefcase } from 'lucide-react';

type UserFormProps = {
    onSubmit: (data: UserFormData) => Promise<void> | void;
    initialData?: UserFormData;
    isSubmitting?: boolean;
};

export function UserForm({ onSubmit, initialData, isSubmitting = false }: UserFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
        resolver: yupResolver(userFormSchema),
        defaultValues: initialData || { name: '', email: '', role: 'aluno' }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="Nome Completo"
                type="text"
                icon={<User />}
                error={errors.name?.message}
                {...register('name')}
            />
            <Input
                label="Email"
                type="email"
                icon={<Mail />}
                error={errors.email?.message}
                {...register('email')}
            />
            <Input
                label="Cargo (aluno, professor, funcionario)"
                type="text"
                icon={<Briefcase />}
                error={errors.role?.message}
                {...register('role')}
            />

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    {initialData ? 'Salvar Alterações' : 'Criar Usuário'}
                </Button>
            </div>
        </form>
    );
}