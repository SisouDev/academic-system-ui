import { PageHeader } from '../../components/pageheader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import UIkit from 'uikit';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';

const validationSchema = yup.object({
    firstName: yup.string().required("O nome é obrigatório"),
    lastName: yup.string().required("O sobrenome é obrigatório"),
    email: yup.string().email("Formato de email inválido").required("O email é obrigatório"),
    academicBackground: yup.string().required("A formação é obrigatória"),
    documentType: yup.string().required("O tipo de documento é obrigatório"),
    documentNumber: yup.string().required("O número do documento é obrigatório"),
}).required();

type FormInputs = yup.InferType<typeof validationSchema>;

const fetchTeacherById = async (teacherId: string) => {
    const { data } = await api.get(`/api/v1/teachers/${teacherId}`);
    return data;
};

const createTeacherRequest = async (payload: any) => {
    const { data } = await api.post('/api/v1/teachers', payload);
    return data;
};

const updateTeacherRequest = async ({ teacherId, payload }: { teacherId: string, payload: any }) => {
    const { data } = await api.put(`/api/v1/teachers/${teacherId}`, payload);
    return data;
};

export function TeacherFormPage() {
    const { teacherId } = useParams<{ teacherId: string }>();
    const isEditMode = !!teacherId;
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: teacherData, isLoading: isLoadingTeacher } = useQuery({
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
                documentType: teacherData.document.type,
                documentNumber: teacherData.document.number,
            };
            reset(defaultValues);
        }
    }, [teacherData, isEditMode, reset]);

    const mutation = useMutation({
        mutationFn: (payload: any) =>
            isEditMode
                ? updateTeacherRequest({ teacherId: teacherId!, payload })
                : createTeacherRequest(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['teachers'] });
            if (isEditMode) {
                await queryClient.invalidateQueries({ queryKey: ['teacher', teacherId] });
            }
            UIkit.notification({
                message: `<span data-uk-icon='icon: check'></span> Professor ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`,
                status: 'success',
                pos: 'top-right'
            });
            navigate('/professores');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error.response?.data?.message || `Ocorreu um erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} o professor.`;
            UIkit.notification({
                message: `<span data-uk-icon='icon: warning'></span> ${errorMessage}`,
                status: 'danger',
                pos: 'top-right'
            });
        }
    });

    const onSubmit: SubmitHandler<FormInputs> = (formData) => {
        const payload = {
            ...formData,
            institutionId: user?.institutionId,
            document: {
                type: formData.documentType,
                number: formData.documentNumber,
            },
        };
        mutation.mutate(payload);
    };

    if (isLoadingTeacher) {
        return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    return (
        <div>
            <PageHeader title={isEditMode ? "Editar Professor" : "Cadastrar Novo Professor"} />
            <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
                <div className="uk-card uk-card-default uk-card-body">
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Dados Pessoais</legend>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="firstName">Nome</label>
                                <input className={`uk-input ${errors.firstName ? 'uk-form-danger' : ''}`} id="firstName" type="text" {...register("firstName")} />
                                {errors.firstName && <p className="uk-text-danger">{errors.firstName.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="lastName">Sobrenome</label>
                                <input className={`uk-input ${errors.lastName ? 'uk-form-danger' : ''}`} id="lastName" type="text" {...register("lastName")} />
                                {errors.lastName && <p className="uk-text-danger">{errors.lastName.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="email">Email</label>
                                <input className={`uk-input ${errors.email ? 'uk-form-danger' : ''}`} id="email" type="email" {...register("email")} />
                                {errors.email && <p className="uk-text-danger">{errors.email.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
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
                        </div>
                    </fieldset>
                    <hr className="uk-divider-icon" />
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Documento</legend>
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
                                <input className={`uk-input ${errors.documentNumber ? 'uk-form-danger' : ''}`} id="documentNumber" type="text" {...register("documentNumber")} />
                                {errors.documentNumber && <p className="uk-text-danger">{errors.documentNumber.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="uk-margin uk-text-right">
                    <Link to="/professores" className="uk-button uk-button-default uk-margin-small-right">Cancelar</Link>
                    <button type="submit" className="uk-button uk-button-primary" disabled={mutation.isPending}>
                        {mutation.isPending ? <div data-uk-spinner="ratio: 0.8"></div> : (isEditMode ? 'Atualizar Professor' : 'Salvar Professor')}
                    </button>
                </div>
            </form>
        </div>
    );
}