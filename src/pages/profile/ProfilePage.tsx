import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/pageheader';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { AxiosError } from 'axios';
import UIkit from 'uikit';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function capitalize(str: string | null | undefined): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const passwordValidationSchema = yup.object({
    oldPassword: yup.string().required("A senha atual é obrigatória"),
    newPassword: yup.string()
        .required("A nova senha é obrigatória")
        .min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmNewPassword: yup.string()
        .required("A confirmação da senha é obrigatória")
        .oneOf([yup.ref('newPassword')], 'As senhas não coincidem'),
}).required();

type PasswordFormInputs = yup.InferType<typeof passwordValidationSchema>;

const updatePasswordRequest = async (payload: Omit<PasswordFormInputs, 'confirmNewPassword'>) => {
    const { data } = await api.put('/api/v1/users/me/password', payload);
    return data;
};

const fetchBaseUser = async (userId: string) => {
    const { data } = await api.get(`/api/v1/users/${userId}`);
    return data;
};

const fetchDetailedProfile = async (person: any) => {
    if (!person || !person.personType) return null;

    let endpoint = '';
    switch (person.personType) {
        case 'STUDENT':
            endpoint = `/api/v1/students/${person.id}`;
            break;
        case 'TEACHER':
            endpoint = `/api/v1/teachers/${person.id}`;
            break;
        case 'EMPLOYEE':
        case 'STAFF':
            endpoint = `/api/v1/employees/${person.id}`;
            break;
        default:
            return person;
    }
    const { data } = await api.get(endpoint);
    return data;
};

export function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const { user: loggedInUser, logout } = useAuth();
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { data: baseUser, isLoading: isLoadingBaseUser } = useQuery({
        queryKey: ['baseUser', userId],
        queryFn: () => fetchBaseUser(userId!),
        enabled: !!userId,
    });

    const { data: detailedProfile, isLoading: isLoadingDetails, isError } = useQuery({
        queryKey: ['detailedProfile', baseUser?.person?.id],
        queryFn: () => fetchDetailedProfile(baseUser.person),
        enabled: !!baseUser?.person?.personType,
    });

    const personDetails = detailedProfile || baseUser?.person;
    const isOwnProfile = loggedInUser?.id === Number(userId);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormInputs>({
        resolver: yupResolver(passwordValidationSchema),
    });

    const passwordMutation = useMutation({
        mutationFn: updatePasswordRequest,
        onSuccess: () => {
            UIkit.notification({
                message: '<span data-uk-icon="icon: check"></span> Senha alterada com sucesso! Você será desconectado por segurança.',
                status: 'success',
                pos: 'top-right',
                timeout: 4000
            });
            setShowPasswordForm(false);
            setTimeout(() => {
                logout();
            }, 4000);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error.response?.data?.message || 'Não foi possível alterar a senha.';
            UIkit.notification({
                message: `<span data-uk-icon="icon: warning"></span> ${errorMessage}`,
                status: 'danger',
                pos: 'top-right'
            });
        }
    });

    const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = (formData) => {
        const { oldPassword, newPassword } = formData;
        passwordMutation.mutate({ oldPassword, newPassword });
        reset();
    };

    const renderRoleSpecificDetails = (person: any) => {
        if (!person) return null;

        switch (person.personType) {
            case 'TEACHER':
                return (
                    <>
                        <dt>Formação Acadêmica</dt>
                        <dd>{capitalize(person.academicBackground) || 'Não informado'}</dd>
                        <dt>Turmas que leciona</dt>
                        <dd>
                            <ul className="uk-list uk-list-bullet">
                                {person.courseSections && person.courseSections.length > 0
                                    ? person.courseSections.map((section: any) => (
                                        <li key={section.id}>
                                            {section.name}
                                            {section.subjectInfo && (
                                                <span className="uk-text-meta uk-display-block">
                                        {section.subjectInfo.subjectName} - {section.subjectInfo.courseName}
                                    </span>
                                            )}
                                        </li>
                                    ))
                                    : 'Nenhuma turma atribuída.'}
                            </ul>
                        </dd>
                    </>
                );
            case 'STUDENT':
                return (
                    <>
                        <dt>Data de Nascimento</dt>
                        <dd>{person.birthDate ? new Date(person.birthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informada'}</dd>
                        <dt>Localização</dt>
                        <dd>{person.address?.city || 'Não informada'}</dd>
                    </>
                );
            case 'EMPLOYEE':
            case 'STAFF':
                return (
                    <>
                        <dt>Cargo</dt>
                        <dd>{person.jobPosition || 'Administrador'}</dd>
                        <dt>Data de Contratação</dt>
                        <dd>{person.hiringDate ? new Date(person.hiringDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Não informada'}</dd>
                    </>
                );
            default:
                return null;
        }
    };

    const isLoading = isLoadingBaseUser || isLoadingDetails;

    if (isLoading) {
        return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    if (isError || !personDetails) {
        return <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar o perfil do usuário.</p></div>;
    }

    return (
        <div>
            <PageHeader title="Perfil de Usuário" />
            <div className="uk-grid-medium" data-uk-grid>
                <div className="uk-width-1-3@m">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3 className="uk-card-title">{personDetails.fullName || `${personDetails.firstName} ${personDetails.lastName}`}</h3>
                        <dl className="uk-description-list uk-description-list-divider">
                            <dt>Email / Login</dt>
                            <dd>{baseUser.login}</dd>
                            <dt>Status</dt>
                            <dd>{capitalize(personDetails.status)}</dd>
                            {renderRoleSpecificDetails(personDetails)}
                            <dt>Instituição</dt>
                            <dd>{personDetails.institution.name}</dd>
                        </dl>
                    </div>
                </div>
                <div className="uk-width-2-3@m">
                    {isOwnProfile && (
                        <div className="uk-card uk-card-default uk-card-body">
                            <div className="uk-flex uk-flex-between uk-flex-middle">
                                <h3 className="uk-card-title uk-margin-remove">Segurança da Conta</h3>
                                {!showPasswordForm && (
                                    <button className="uk-button uk-button-default uk-button-small" onClick={() => setShowPasswordForm(true)}>
                                        Alterar Senha
                                    </button>
                                )}
                            </div>
                            {showPasswordForm && (
                                <form className="uk-margin-top" onSubmit={handleSubmit(onPasswordSubmit)}>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" htmlFor="oldPassword">Senha Atual</label>
                                        <div className="uk-form-controls">
                                            <input className={`uk-input ${errors.oldPassword ? 'uk-form-danger' : ''}`} id="oldPassword" type="password" {...register("oldPassword")} />
                                        </div>
                                        {errors.oldPassword && <p className="uk-text-danger">{errors.oldPassword.message}</p>}
                                    </div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" htmlFor="newPassword">Nova Senha</label>
                                        <div className="uk-form-controls">
                                            <input className={`uk-input ${errors.newPassword ? 'uk-form-danger' : ''}`} id="newPassword" type="password" {...register("newPassword")} />
                                        </div>
                                        {errors.newPassword && <p className="uk-text-danger">{errors.newPassword.message}</p>}
                                    </div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" htmlFor="confirmNewPassword">Confirme a Nova Senha</label>
                                        <div className="uk-form-controls">
                                            <input className={`uk-input ${errors.confirmNewPassword ? 'uk-form-danger' : ''}`} id="confirmNewPassword" type="password" {...register("confirmNewPassword")} />
                                        </div>
                                        {errors.confirmNewPassword && <p className="uk-text-danger">{errors.confirmNewPassword.message}</p>}
                                    </div>
                                    <div className="uk-text-right">
                                        <button type="button" className="uk-button uk-button-default uk-margin-small-right" onClick={() => setShowPasswordForm(false)}>Cancelar</button>
                                        <button type="submit" className="uk-button uk-button-primary" disabled={passwordMutation.isPending}>
                                            {passwordMutation.isPending ? <div data-uk-spinner="ratio: 0.8"></div> : 'Salvar Nova Senha'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}