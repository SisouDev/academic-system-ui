import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FiSave } from 'react-icons/fi';


type StudentFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    documentType: string;
    documentNumber: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
};

const fetchStudentDetails = async (studentId: string) => {
    const { data } = await api.get(`/api/v1/students/${studentId}`);
    return {
        ...data,
        documentType: data.document?.type,
        documentNumber: data.document?.number,
        street: data.address?.street,
        number: data.address?.number,
        complement: data.address?.complement,
        district: data.address?.district,
        city: data.address?.city,
        state: data.address?.state,
        zipCode: data.address?.zipCode,
    };
};

function StudentForm() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { user: loggedInUser } = useAuth();
    const isEditing = !!studentId;

    const { data: studentData, isLoading } = useQuery({
        queryKey: ['studentDetails', studentId],
        queryFn: () => fetchStudentDetails(studentId!),
        enabled: isEditing,
    });

    const { register, handleSubmit, reset } = useForm<StudentFormData>();

    useEffect(() => {
        if (isEditing && studentData) {
            reset(studentData);
        }
    }, [studentData, isEditing, reset]);

    const { mutate: saveStudent, isPending: isSaving } = useMutation({
        mutationFn: (formData: StudentFormData) => {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                birthDate: formData.birthDate,
                institutionId: loggedInUser?.institutionId,
                document: {
                    type: formData.documentType,
                    number: formData.documentNumber,
                },
                address: {
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    district: formData.district,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                },
            };

            if (isEditing) {
                return api.put(`/api/v1/students/${studentId}`, payload);
            } else {
                return api.post('/api/v1/students', payload);
            }
        },
        onSuccess: () => {
            toast.success(`Aluno ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/admin/students');
        },
        onError: () => toast.error(`Ocorreu um erro ao salvar o aluno.`),
    });

    const onSubmit: SubmitHandler<StudentFormData> = (formData) => {
        saveStudent(formData);
    };

    if (isLoading) return <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="uk-form-stacked">
            <h1 className="uk-heading-medium">{isEditing ? `Editando Aluno: ${studentData?.firstName || ''}` : 'Novo Aluno'}</h1>

            <fieldset className="uk-fieldset uk-margin">
                <legend className="uk-legend">Dados Pessoais</legend>
                <div className="uk-grid-small" data-uk-grid>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Nome</label><input className="uk-input" {...register('firstName', { required: true })} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Sobrenome</label><input className="uk-input" {...register('lastName', { required: true })} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Email</label><input className="uk-input" type="email" {...register('email', { required: true })} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Telefone</label><input className="uk-input" {...register('phone')} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Data de Nascimento</label><input className="uk-input" type="date" {...register('birthDate')} /></div>
                </div>
            </fieldset>

            <fieldset className="uk-fieldset uk-margin">
                <legend className="uk-legend">Documento</legend>
                <div className="uk-grid-small" data-uk-grid>
                    <div className="uk-width-1-3@s"><label className="uk-form-label">Tipo</label><input className="uk-input" {...register('documentType')} /></div>
                    <div className="uk-width-2-3@s"><label className="uk-form-label">Número</label><input className="uk-input" {...register('documentNumber')} /></div>
                </div>
            </fieldset>

            <fieldset className="uk-fieldset uk-margin">
                <legend className="uk-legend">Endereço</legend>
                <div className="uk-grid-small" data-uk-grid>
                    <div className="uk-width-2-3@s"><label className="uk-form-label">Rua</label><input className="uk-input" {...register('street')} /></div>
                    <div className="uk-width-1-3@s"><label className="uk-form-label">Número</label><input className="uk-input" {...register('number')} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Complemento</label><input className="uk-input" {...register('complement')} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Bairro</label><input className="uk-input" {...register('district')} /></div>
                    <div className="uk-width-1-2@s"><label className="uk-form-label">Cidade</label><input className="uk-input" {...register('city')} /></div>
                    <div className="uk-width-1-4@s"><label className="uk-form-label">Estado (UF)</label><input className="uk-input" maxLength={2} {...register('state')} /></div>
                    <div className="uk-width-1-4@s"><label className="uk-form-label">CEP</label><input className="uk-input" {...register('zipCode')} /></div>
                </div>
            </fieldset>

            <div className="uk-margin-medium-top">
                <button type="submit" className="uk-button uk-button-primary uk-button-large" disabled={isSaving}>
                    <FiSave className="uk-margin-small-right" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    );
}

const queryClient = new QueryClient();
export function StudentFormPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <div className="page-content-card">
                    <StudentForm />
                </div>
            </div>
        </QueryClientProvider>
    );
}