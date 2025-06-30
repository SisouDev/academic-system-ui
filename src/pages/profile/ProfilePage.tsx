import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/pageheader';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { AxiosError } from 'axios';
import UIkit from 'uikit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { useParams, useNavigate, Link } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Avatar } from '../../components/avatar';
import { ActionCard } from '../../components/card/ActionCard';
import moment from 'moment';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'moment/locale/pt-br';

moment.locale('pt-br');

const passwordValidationSchema = yup.object({
    oldPassword: yup.string().required("A senha atual é obrigatória"),
    newPassword: yup.string().required("A nova senha é obrigatória").min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmNewPassword: yup.string().required("A confirmação da senha é obrigatória").oneOf([yup.ref('newPassword')], 'As senhas não coincidem'),
}).required();

type PasswordFormInputs = yup.InferType<typeof passwordValidationSchema>;

const updatePasswordRequest = async (payload: Omit<PasswordFormInputs, 'confirmNewPassword'>) => {
    const { data } = await api.put('/api/v1/users/me/password', payload);
    return data;
};

const fetchUserById = async (userId: string) => {
    const { data } = await api.get(`/api/v1/users/${userId}`);
    return data;
};

const fetchDetailedProfile = async (person: any) => {
    if (!person || !person.personType) {
        return null;
    }
    let endpoint = '';
    switch (person.personType) {
        case 'STUDENT': endpoint = `/api/v1/students/${person.id}`; break;
        case 'TEACHER': endpoint = `/api/v1/teachers/${person.id}`; break;
        case 'EMPLOYEE': case 'STAFF': endpoint = `/api/v1/employees/${person.id}`; break;
        default: return person;
    }
    const { data } = await api.get(endpoint);
    return data;
};

const uploadAvatarRequest = async (formData: FormData) => {
    const { data } = await api.post('/api/v1/users/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const { user: loggedInUser, logout } = useAuth();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: baseUser, isLoading: isLoadingBaseUser } = useQuery({
        queryKey: ['baseUser', userId],
        queryFn: () => fetchUserById(userId!),
        enabled: !!userId,
    });

    const { data: detailedProfile, isLoading: isLoadingDetails, isError } = useQuery({
        queryKey: ['detailedProfile', baseUser?.person?.id],
        queryFn: () => fetchDetailedProfile(baseUser.person),
        enabled: !!baseUser?.person?.personType,
    });

    const personDetails = detailedProfile || baseUser?.person;
    const isOwnProfile = loggedInUser?.id === Number(userId);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormInputs>({ resolver: yupResolver(passwordValidationSchema) });

    const passwordMutation = useMutation({
        mutationFn: updatePasswordRequest,
        onSuccess: () => {
            UIkit.notification({ message: `<span data-uk-icon='icon: check'></span> Senha alterada com sucesso! Você será desconectado por segurança.`, status: 'success', pos: 'top-right', timeout: 4000 });
            setShowPasswordForm(false);
            reset();
            setTimeout(() => { logout(); }, 4000);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error.response?.data?.message || 'Não foi possível alterar a senha.';
            UIkit.notification({ message: `<span data-uk-icon='icon: warning'></span> ${errorMessage}`, status: 'danger', pos: 'top-right' });
        }
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: uploadAvatarRequest,
        onSuccess: async () => {
            UIkit.notification({ message: '<span data-uk-icon="icon: check"></span> Foto de perfil atualizada!', status: 'success', pos: 'top-right' });
            await queryClient.invalidateQueries({ queryKey: ['detailedProfile', baseUser?.person?.id] });
        },
        onError: () => {
            UIkit.notification({ message: '<span data-uk-icon="icon: warning"></span> Erro ao enviar a imagem.', status: 'danger', pos: 'top-right' });
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            uploadAvatarMutation.mutate(formData);
        }
    };

    const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = (formData) => {
        const { oldPassword, newPassword } = formData;
        passwordMutation.mutate({ oldPassword, newPassword });
    };

    const capitalize = (str: string | null | undefined): string => {
        if (!str) return 'Não informado';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleEditProfile = () => {
        if (!personDetails) return;
        const type = personDetails.personType.toLowerCase();
        const validTypes = ['student', 'teacher', 'employee'];
        if (validTypes.includes(type)) {
            navigate(`/${type}s/editar/${personDetails.id}`);
        } else {
            UIkit.notification({ message: 'Não há uma página de edição para este tipo de perfil.', status: 'warning', pos: 'top-right' });
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
                    <div className="uk-card uk-card-default uk-margin-bottom">
                        <div className="uk-card-media-top uk-text-center uk-padding-small">
                            <div className="uk-inline">
                                <Avatar name={`${personDetails.firstName} ${personDetails.lastName}`} src={personDetails.profilePictureUrl} size="large" />
                                {uploadAvatarMutation.isPending ? (
                                    <div className="uk-position-cover uk-flex uk-flex-center uk-flex-middle" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%'}}>
                                        <div data-uk-spinner></div>
                                    </div>
                                ) : (
                                    isOwnProfile && (
                                        <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-padding-small" style={{ borderRadius: '0 0 60px 60px' }}>
                                            <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                                                <span data-uk-icon="icon: camera"></span> Trocar
                                            </label>
                                            <input id="avatar-upload" type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="uk-card-body">
                            <h3 className="uk-card-title uk-text-center uk-margin-remove">{`${personDetails.firstName} ${personDetails.lastName}`}</h3>
                            <p className="uk-text-center uk-text-meta uk-margin-remove-top">{capitalize(personDetails.personType)}</p>
                            <dl className="uk-description-list uk-description-list-divider uk-margin-top">
                                <dt>Email</dt>
                                <dd>{baseUser.login}</dd>
                                <dt>Status</dt>
                                <dd>{capitalize(personDetails.status)}</dd>
                                <dt>Instituição</dt>
                                <dd>{personDetails.institution.name}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="uk-width-2-3@m">
                    {isOwnProfile && (
                        <div className="uk-margin-bottom">
                            <div className="uk-child-width-1-2@s uk-child-width-1-4@m" data-uk-grid>
                                <div><ActionCard icon="pencil" title="Editar Perfil" description="Atualize seus dados" onClick={handleEditProfile} /></div>
                                <div><ActionCard icon="lock" title="Trocar Senha" description="Altere sua senha" onClick={() => setShowPasswordForm(!showPasswordForm)} /></div>
                                <div><ActionCard icon="history" title="Histórico" description="Ver atividade" onClick={() => UIkit.notification({ message: 'Funcionalidade em desenvolvimento.'})} /></div>
                                <div><ActionCard icon="sign-out" title="Sair" description="Encerrar sessão" onClick={logout} /></div>
                            </div>
                        </div>
                    )}

                    {isOwnProfile && showPasswordForm && (
                        <div className="uk-card uk-card-default uk-card-body uk-margin-bottom">
                            <h3 className="uk-card-title">Alterar Senha</h3>
                            <form className="uk-margin-top" onSubmit={handleSubmit(onPasswordSubmit)}>
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="oldPassword">Senha Atual</label>
                                    <input className={`uk-input ${errors.oldPassword ? 'uk-form-danger' : ''}`} id="oldPassword" type="password" {...register("oldPassword")} />
                                    {errors.oldPassword && <p className="uk-text-danger">{errors.oldPassword.message}</p>}
                                </div>
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="newPassword">Nova Senha</label>
                                    <input className={`uk-input ${errors.newPassword ? 'uk-form-danger' : ''}`} id="newPassword" type="password" {...register("newPassword")} />
                                    {errors.newPassword && <p className="uk-text-danger">{errors.newPassword.message}</p>}
                                </div>
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="confirmNewPassword">Confirme a Nova Senha</label>
                                    <input className={`uk-input ${errors.confirmNewPassword ? 'uk-form-danger' : ''}`} id="confirmNewPassword" type="password" {...register("confirmNewPassword")} />
                                    {errors.confirmNewPassword && <p className="uk-text-danger">{errors.confirmNewPassword.message}</p>}
                                </div>
                                <div className="uk-text-right">
                                    <button type="button" className="uk-button uk-button-default uk-margin-small-right" onClick={() => { setShowPasswordForm(false); reset(); }}>Cancelar</button>
                                    <button type="submit" className="uk-button uk-button-primary" disabled={passwordMutation.isPending}>
                                        {passwordMutation.isPending ? <div data-uk-spinner="ratio: 0.8"></div> : 'Salvar Nova Senha'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}