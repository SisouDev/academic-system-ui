import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hook/useAuth.ts';

type ProfileFormData = { email: string; phone: string; };
type UserProfile = ProfileFormData & { id: number };

const fetchMyProfileForEdit = async (personId: number): Promise<UserProfile> => {
    const response = await api.get(`/api/v1/employees/${personId}`);
    return response.data;
};

const updateMyProfile = async ({ personId, data }: { personId: number, data: ProfileFormData }) => {
    const response = await api.put(`/api/v1/employees/${personId}`, data);
    return response.data;
};

function ProfileEditForm() {
    const navigate = useNavigate();
    const { personId } = useAuth();

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['myProfileForEdit', personId],
        queryFn: () => fetchMyProfileForEdit(personId!),
        enabled: !!personId,
    });

    const { register, handleSubmit, reset } = useForm<ProfileFormData>();

    useEffect(() => {
        if (profileData) reset(profileData);
    }, [profileData, reset]);

    const { mutate: saveProfile, isPending: isSaving } = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            toast.success('Perfil atualizado!');
            navigate(`/perfil/${personId}`);
        },
        onError: () => toast.error('Falha ao atualizar o perfil.'),
    });

    const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
        if (personId) {
            saveProfile({ personId, data });
        }
    };

    if (isLoading) return <div>Carregando...</div>;

    return (
        <div className="page-content-card">
            <h1 className="uk-heading-medium">Editar Meu Perfil</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="uk-form-stacked">
                <div className="uk-margin">
                    <label className="uk-form-label">Email</label>
                    <input className="uk-input" type="email" {...register('email')} />
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label">Telefone</label>
                    <input className="uk-input" type="text" {...register('phone')} />
                </div>
                <div className="uk-margin">
                    <button type="submit" className="uk-button uk-button-primary" disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button type="button" className="uk-button uk-button-default uk-margin-small-left" onClick={() => navigate(`/perfil/${personId}`)}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

const queryClient = new QueryClient();
export function MyProfileEditPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <ProfileEditForm />
            </div>
        </QueryClientProvider>
    );
}