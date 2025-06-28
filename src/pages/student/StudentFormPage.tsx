import { PageHeader } from '../../components/pageheader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler, type FieldValues, type FieldErrors } from 'react-hook-form';
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
    birthDate: yup.string().required("A data de nascimento é obrigatória"),
    documentType: yup.string().required("O tipo de documento é obrigatório"),
    documentNumber: yup.string().required("O número do documento é obrigatório"),
    street: yup.string().required("A rua é obrigatória"),
    number: yup.string().required("O número é obrigatório"),
    complement: yup.string().optional().nullable(),
    district: yup.string().required("O bairro é obrigatório"),
    city: yup.string().required("A cidade é obrigatória"),
    state: yup.string().required("O estado é obrigatório"),
    zipCode: yup.string().required("O CEP é obrigatório"),
}).required();

type FormInputs = yup.InferType<typeof validationSchema>;

type StudentPayload = {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    institutionId?: number;
    document: {
        type: string;
        number: string;
    };
    address: {
        street: string;
        number: string;
        complement?: string | null;
        district: string;
        city: string;
        state: string;
        zipCode: string;
    };
};

const fetchStudentById = async (studentId: string) => {
    const { data } = await api.get(`/api/v1/students/${studentId}`);
    return data;
};

const createStudentRequest = async (payload: StudentPayload) => {
    const { data } = await api.post('/api/v1/students', payload);
    return data;
};

const updateStudentRequest = async ({ studentId, payload }: { studentId: string, payload: StudentPayload }) => {
    const { data } = await api.put(`/api/v1/students/${studentId}`, payload);
    return data;
};

export function StudentFormPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const isEditMode = !!studentId;
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: studentData, isLoading: isLoadingStudent } = useQuery({
        queryKey: ['student', studentId],
        queryFn: () => fetchStudentById(studentId!),
        enabled: isEditMode,
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (isEditMode && studentData) {
            const defaultValues = {
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                birthDate: studentData.birthDate,
                documentType: studentData.document.type,
                documentNumber: studentData.document.number,
                street: studentData.address?.street || '',
                number: studentData.address?.number || '',
                complement: studentData.address?.complement || '',
                district: studentData.address?.district || '',
                city: studentData.address?.city || '',
                state: studentData.address?.state || '',
                zipCode: studentData.address?.zipCode || '',
            };
            reset(defaultValues);
        }
    }, [studentData, isEditMode, reset]);

    const mutation = useMutation({
        mutationFn: (payload: StudentPayload) =>
            isEditMode
                ? updateStudentRequest({ studentId: studentId!, payload })
                : createStudentRequest(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['students'] });
            if (isEditMode) {
                await queryClient.invalidateQueries({ queryKey: ['student', studentId] });
            }
            UIkit.notification({
                message: `<span data-uk-icon='icon: check'></span> Aluno ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`,
                status: 'success',
                pos: 'top-right'
            });
            navigate('/alunos');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error.response?.data?.message || `Ocorreu um erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} o aluno.`;
            UIkit.notification({
                message: `<span data-uk-icon='icon: warning'></span> ${errorMessage}`,
                status: 'danger',
                pos: 'top-right'
            });
        }
    });

    const onValidSubmit: SubmitHandler<FormInputs> = (formData) => {
        console.log("✅ Validação passou! Enviando estes dados:", formData);

        const payload: StudentPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            birthDate: formData.birthDate,
            institutionId: user?.institutionId,
            document: {
                type: formData.documentType,
                number: formData.documentNumber,
            },
            address: {
                street: formData.street,
                number: formData.number,
                complement: formData.complement || undefined,
                district: formData.district,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
            }
        };
        mutation.mutate(payload);
    };

    const onInvalidSubmit = (errors: FieldErrors<FormInputs>) => {
        console.error("❌ Validação falhou! Campos com erro:", errors);
    };

    if (isLoadingStudent) {
        return <div className="uk-flex uk-flex-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    return (
        <div>
            <PageHeader title={isEditMode ? "Editar Aluno" : "Cadastrar Novo Aluno"} />
            <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
                <div className="uk-card uk-card-default uk-card-body">
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Dados Pessoais</legend>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="firstName">Nome</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.firstName ? 'uk-form-danger' : ''}`} id="firstName" type="text" {...register("firstName")} />
                                </div>
                                {errors.firstName && <p className="uk-text-danger">{errors.firstName.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="lastName">Sobrenome</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.lastName ? 'uk-form-danger' : ''}`} id="lastName" type="text" {...register("lastName")} />
                                </div>
                                {errors.lastName && <p className="uk-text-danger">{errors.lastName.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="email">Email</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.email ? 'uk-form-danger' : ''}`} id="email" type="email" {...register("email")} />
                                </div>
                                {errors.email && <p className="uk-text-danger">{errors.email.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="birthDate">Data de Nascimento</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.birthDate ? 'uk-form-danger' : ''}`} id="birthDate" type="date" {...register("birthDate")} />
                                </div>
                                {errors.birthDate && <p className="uk-text-danger">{errors.birthDate.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                    <hr className="uk-divider-icon" />
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Documento</legend>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-3@s">
                                <label className="uk-form-label" htmlFor="documentType">Tipo</label>
                                <div className="uk-form-controls">
                                    <select className={`uk-select ${errors.documentType ? 'uk-form-danger' : ''}`} id="documentType" {...register("documentType")}>
                                        <option value="">Selecione...</option>
                                        <option value="NATIONAL_ID">CPF</option>
                                        <option value="PASSPORT">Passaporte</option>
                                        <option value="OTHER">Outro</option>
                                    </select>
                                </div>
                                {errors.documentType && <p className="uk-text-danger">{errors.documentType.message}</p>}
                            </div>
                            <div className="uk-width-2-3@s">
                                <label className="uk-form-label" htmlFor="documentNumber">Número</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.documentNumber ? 'uk-form-danger' : ''}`} id="documentNumber" type="text" {...register("documentNumber")} />
                                </div>
                                {errors.documentNumber && <p className="uk-text-danger">{errors.documentNumber.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Endereço</legend>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-2-3@s">
                                <label className="uk-form-label" htmlFor="street">Rua</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.street ? 'uk-form-danger' : ''}`} id="street" type="text" {...register("street")} />
                                </div>
                                {errors.street && <p className="uk-text-danger">{errors.street.message}</p>}
                            </div>
                            <div className="uk-width-1-3@s">
                                <label className="uk-form-label" htmlFor="number">Número</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.number ? 'uk-form-danger' : ''}`} id="number" type="text" {...register("number")} />
                                </div>
                                {errors.number && <p className="uk-text-danger">{errors.number.message}</p>}
                            </div>
                            <div className="uk-width-1-1">
                                <label className="uk-form-label" htmlFor="complement">Complemento</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.complement ? 'uk-form-danger' : ''}`} id="complement" type="text" {...register("complement")} />
                                </div>
                                {errors.complement && <p className="uk-text-danger">{errors.complement.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="district">Bairro</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.district ? 'uk-form-danger' : ''}`} id="district" type="text" {...register("district")} />
                                </div>
                                {errors.district && <p className="uk-text-danger">{errors.district.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="city">Cidade</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.city ? 'uk-form-danger' : ''}`} id="city" type="text" {...register("city")} />
                                </div>
                                {errors.city && <p className="uk-text-danger">{errors.city.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="state">Estado</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.state ? 'uk-form-danger' : ''}`} id="state" type="text" {...register("state")} />
                                </div>
                                {errors.state && <p className="uk-text-danger">{errors.state.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="zipCode">CEP</label>
                                <div className="uk-form-controls">
                                    <input className={`uk-input ${errors.zipCode ? 'uk-form-danger' : ''}`} id="zipCode" type="text" {...register("zipCode")} />
                                </div>
                                {errors.zipCode && <p className="uk-text-danger">{errors.zipCode.message}</p>}
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="uk-margin uk-text-right">
                    <Link to="/alunos" className="uk-button uk-button-default uk-margin-small-right">Cancelar</Link>
                    <button type="submit" className="uk-button uk-button-primary" disabled={mutation.isPending}>
                        {mutation.isPending ? <div data-uk-spinner="ratio: 0.8"></div> : (isEditMode ? 'Atualizar Aluno' : 'Salvar Aluno')}
                    </button>
                </div>
            </form>
        </div>
    );
}