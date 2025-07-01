import { useEffect } from 'react';
import { PageHeader } from '../../components/pageheader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../hook/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import {object, string, type ObjectSchema} from 'yup';
import type { AxiosError } from 'axios';
import { FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';


type FormInputs = {
    firstName: string;
    lastName: string;
    email: string;
    academicBackground: string;
    documentType?: string | null;
    documentNumber?: string | null;
};

const validationSchema: ObjectSchema<FormInputs> = object({
    firstName: string().required("O nome é obrigatório"),
    lastName: string().required("O sobrenome é obrigatório"),
    email: string().email("Formato de email inválido").required("O email é obrigatório"),
    academicBackground: string().required("A formação é obrigatória"),
    documentType: string().notRequired(),
    documentNumber: string().notRequired(),
});

const fetchTeacherById = async (teacherId: string) => {
    const { data } = await api.get(`/api/v1/teachers/${teacherId}`);
    return data;
};

const saveTeacher = ({ teacherId, payload }: { teacherId?: string, payload: any }) => {
    if (teacherId) {
        return api.put(`/api/v1/teachers/${teacherId}`, payload);
    }
    return api.post('/api/v1/teachers', payload);
};

function TeacherForm() {
    const { teacherId } = useParams<{ teacherId: string }>();
    const isEditMode = !!teacherId;
    const navigate = useNavigate();
    const { institutionId } = useAuth();
    const queryClient = useQueryClient();

    const { data: teacherData, isLoading } = useQuery({
        queryKey: ['teacher', teacherId],
        queryFn: () => fetchTeacherById(teacherId!),
        enabled: isEditMode,
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (isEditMode && teacherData) {
            const defaultValues = {
                firstName: teacherData.firstName,
                lastName: teacherData.lastName,
                email: teacherData.email,
                academicBackground: teacherData.academicBackground,
                documentType: teacherData.document?.type,
                documentNumber: teacherData.document?.number,
            };
            reset(defaultValues);
        }
    }, [teacherData, isEditMode, reset]);

    const { mutate: saveMutation, isPending: isSaving } = useMutation({
        mutationFn: saveTeacher,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['teachers'] });
            toast.success(`Professor ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
            navigate('/admin/teachers');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Ocorreu um erro.');
        }
    });

    const onSubmit: SubmitHandler<FormInputs> = (formData) => {
        if (!isEditMode && (!formData.documentType || !formData.documentNumber)) {
            toast.error("Tipo e Número do documento são obrigatórios para novos professores.");
            return;
        }

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            academicBackground: formData.academicBackground,
            institutionId: institutionId,
            document: {
                type: formData.documentType,
                number: formData.documentNumber,
            },
        };
        saveMutation({ teacherId, payload });
    };

    if (isLoading) {
        return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    return (
        <div className="page-content-card">
            <PageHeader title={isEditMode ? "Editar Professor" : "Novo Professor"} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="uk-fieldset uk-margin">
                    <legend className="uk-legend">Dados Pessoais</legend>
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-1-2@s">
                            <label className="uk-form-label" htmlFor="firstName">Nome</label>
                            <input className={`uk-input ${errors.firstName ? 'uk-form-danger' : ''}`} id="firstName" {...register("firstName")} />
                            {errors.firstName && <p className="uk-text-danger">{errors.firstName.message}</p>}
                        </div>
                        <div className="uk-width-1-2@s">
                            <label className="uk-form-label" htmlFor="lastName">Sobrenome</label>
                            <input className={`uk-input ${errors.lastName ? 'uk-form-danger' : ''}`} id="lastName" {...register("lastName")} />
                            {errors.lastName && <p className="uk-text-danger">{errors.lastName.message}</p>}
                        </div>
                        <div className="uk-width-1-1">
                            <label className="uk-form-label" htmlFor="email">Email</label>
                            <input className={`uk-input ${errors.email ? 'uk-form-danger' : ''}`} id="email" type="email" {...register("email")} />
                            {errors.email && <p className="uk-text-danger">{errors.email.message}</p>}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="uk-fieldset uk-margin">
                    <legend className="uk-legend">Informações Acadêmicas</legend>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="academicBackground">Formação Acadêmica</label>
                        <select className={`uk-select ${errors.academicBackground ? 'uk-form-danger' : ''}`} id="academicBackground" {...register("academicBackground")}>
                            <option value="">Selecione...</option>
                            <option value="BACHELOR">Bacharelado</option>
                            <option value="LICENTIATE">Licenciatura</option>
                            <option value="SPECIALIZATION">Especialização</option>
                            <option value="MASTER">Mestrado</option>
                            <option value="PHD">Doutorado</option>
                            <option value="POSTDOC">Pós-Doutorado</option>
                        </select>
                        {errors.academicBackground && <p className="uk-text-danger">{errors.academicBackground.message}</p>}
                    </div>
                </fieldset>

                {!isEditMode && (
                    <fieldset className="uk-fieldset uk-margin">
                        <legend className="uk-legend">Documento e Senha Inicial</legend>
                        <p className="uk-text-meta">A senha inicial será o número do documento.</p>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-3@s">
                                <label className="uk-form-label" htmlFor="documentType">Tipo</label>
                                <select className={`uk-select ${errors.documentType ? 'uk-form-danger' : ''}`} id="documentType" {...register("documentType")}>
                                    <option value="">Selecione...</option>
                                    <option value="NATIONAL_ID">CPF</option>
                                    <option value="PASSPORT">Passaporte</option>
                                    <option value="OTHER">Outro</option>
                                </select>
                                {errors.documentType && <p className="uk-text-danger">{errors.documentType.message}</p>}
                            </div>
                            <div className="uk-width-2-3@s">
                                <label className="uk-form-label" htmlFor="documentNumber">Número</label>
                                <input className={`uk-input ${errors.documentNumber ? 'uk-form-danger' : ''}`} id="documentNumber" {...register("documentNumber")} />
                                {errors.documentNumber && <p className="uk-text-danger">{errors.documentNumber.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                )}

                <div className="uk-margin-medium-top uk-text-right">
                    <Link to="/admin/teachers" className="uk-button uk-button-default uk-margin-small-right">Cancelar</Link>
                    <button type="submit" className="uk-button uk-button-primary" disabled={isSaving}>
                        <FiSave className="uk-margin-small-right" />
                        {isSaving ? <div data-uk-spinner="ratio: 0.8"></div> : (isEditMode ? 'Atualizar' : 'Salvar')}
                    </button>
                </div>
            </form>
        </div>
    );
}

const queryClient = new QueryClient();

export function TeacherFormPage() {
    return(
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <TeacherForm />
            </div>
        </QueryClientProvider>
    )
}