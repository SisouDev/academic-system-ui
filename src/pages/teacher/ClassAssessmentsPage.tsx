import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, type SubmitHandler, type FieldErrors } from 'react-hook-form';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '../../components/pageheader';
import UIkit from 'uikit';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type AssessmentDef = {
    id: number;
    title: string;
    type: string;
    assessmentDate: string | null;
    weight: number;
};
type FormInputs = {
    id?: number;
    title: string;
    type: string;
    assessmentDate: string;
    weight: number;
};

const validationSchema = yup.object({
    title: yup.string().required("O título é obrigatório."),
    type: yup.string().required("O tipo é obrigatório."),
    assessmentDate: yup.string().required("A data é obrigatória."),
    weight: yup.number().typeError("O peso deve ser um número.").min(0, "Mínimo 0.").max(100, "Máximo 100.").required("O peso é obrigatório."),
});

type ApiResponse = { _embedded?: { assessmentDefinitionDtoList: AssessmentDef[] } };

const fetchAssessmentDefs = async (courseSectionId: string): Promise<AssessmentDef[]> => {
    const response = await api.get<ApiResponse>(`/api/v1/assessment-definitions?courseSectionId=${courseSectionId}`);
    return response.data._embedded?.assessmentDefinitionDtoList || [];
};
const saveAssessmentDef = ({ courseSectionId, data }: { courseSectionId: string; data: FormInputs }) => {
    const payload = { ...data, courseSectionId: Number(courseSectionId) };
    if (data.id) {
        return api.put(`/api/v1/assessment-definitions/${data.id}`, payload);
    }
    return api.post('/api/v1/assessment-definitions', payload);
};
const deleteAssessmentDef = async (id: number) => {
    await api.delete(`/api/v1/assessment-definitions/${id}`);
};

function ClassAssessments() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const queryClient = useQueryClient();
    const [editingAssessment, setEditingAssessment] = useState<AssessmentDef | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        resolver: yupResolver(validationSchema),
        defaultValues: { title: '', type: 'EXAM', assessmentDate: '', weight: 0 }
    });

    const { data: assessments, isLoading } = useQuery({
        queryKey: ['assessmentDefinitions', courseSectionId],
        queryFn: () => fetchAssessmentDefs(courseSectionId!),
        enabled: !!courseSectionId,
    });

    // ▼▼▼ AQUI ESTÁ A CORREÇÃO PRINCIPAL ▼▼▼
    const { mutate: saveMutation, isPending: isSaving } = useMutation({
        mutationFn: saveAssessmentDef,
        onSuccess: () => {
            toast.success("Avaliação salva com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['assessmentDefinitions', courseSectionId] });
            UIkit.modal('#assessment-form-modal').hide();
        },
        onError: () => toast.error("Erro ao salvar avaliação."),
    });

    const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: deleteAssessmentDef,
        onSuccess: () => {
            toast.success("Avaliação deletada!");
            queryClient.invalidateQueries({ queryKey: ['assessmentDefinitions', courseSectionId] });
        },
        onError: () => toast.error("Erro ao deletar avaliação."),
    });

    const openModal = (assessment: AssessmentDef | null = null) => {
        setEditingAssessment(assessment);
        reset(assessment ? { ...assessment, assessmentDate: assessment.assessmentDate || '' } : { title: '', type: 'EXAM', assessmentDate: '', weight: 0 });
        UIkit.modal('#assessment-form-modal').show();
    };

    const handleDelete = (id: number) => {
        UIkit.modal.confirm('Tem certeza?').then(() => deleteMutation(id), () => {});
    };

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const payload = { ...data, id: editingAssessment?.id };
        saveMutation({ courseSectionId: courseSectionId!, data: payload });
    };

    const onValidationErrors = (errors: FieldErrors<FormInputs>) => {
        const firstError = Object.values(errors)[0]?.message;
        if (firstError) toast.error(firstError);
    };

    return (
        <div className="page-container">
            <PageHeader title="Gerenciamento de Avaliações" />
            <div className="uk-flex uk-flex-right uk-margin">
                <button className="uk-button uk-button-primary" onClick={() => openModal()}>
                    <FiPlus /> Nova Avaliação
                </button>
            </div>
            <div className="page-content-card">
                {isLoading && <div className="uk-text-center"><div data-uk-spinner></div></div>}
                <ul className="uk-list uk-list-divider">
                    {assessments?.map(asm => (
                        <li key={asm.id} className="uk-flex uk-flex-middle uk-flex-between">
                            <div>
                                <p className="uk-text-bold uk-margin-remove">{asm.title} <span className="uk-badge">{asm.type}</span></p>
                                <p className="uk-text-meta uk-margin-remove">
                                    Data: {asm.assessmentDate ? new Date(asm.assessmentDate + 'T00:00:00').toLocaleDateString() : 'A definir'} - Peso: {asm.weight}%
                                </p>
                            </div>
                            <div className="uk-button-group">
                                <button className="uk-button uk-button-default uk-button-small" onClick={() => openModal(asm)}><FiEdit /></button>
                                <button className="uk-button uk-button-danger uk-button-small" onClick={() => handleDelete(asm.id)} disabled={isDeleting}><FiTrash2 /></button>
                            </div>
                        </li>
                    ))}
                </ul>
                {!isLoading && assessments?.length === 0 && <p>Nenhuma avaliação cadastrada.</p>}
            </div>

            <div id="assessment-form-modal" data-uk-modal>
                <div className="uk-modal-dialog uk-modal-body">
                    <button className="uk-modal-close-default" type="button" data-uk-close></button>
                    <h2 className="uk-modal-title">{editingAssessment ? 'Editar Avaliação' : 'Nova Avaliação'}</h2>
                    <form onSubmit={handleSubmit(onSubmit, onValidationErrors)}>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="title">Título</label>
                            <input id="title" className={`uk-input ${errors.title ? 'uk-form-danger' : ''}`} {...register('title')} />
                            {errors.title && <p className="uk-text-danger uk-margin-small-top">{errors.title.message}</p>}
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="type">Tipo</label>
                            <select id="type" className={`uk-select ${errors.type ? 'uk-form-danger' : ''}`} {...register('type')}>
                                <option value="">Selecione...</option>
                                <option value="EXAM">Prova</option>
                                <option value="QUIZ">Quiz</option>
                                <option value="ASSIGNMENT">Trabalho</option>
                                <option value="PROJECT">Projeto</option>
                            </select>
                            {errors.type && <p className="uk-text-danger uk-margin-small-top">{errors.type.message}</p>}
                        </div>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="date">Data</label>
                                <input id="date" className={`uk-input ${errors.assessmentDate ? 'uk-form-danger' : ''}`} type="date" {...register('assessmentDate')} />
                                {errors.assessmentDate && <p className="uk-text-danger uk-margin-small-top">{errors.assessmentDate.message}</p>}
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label" htmlFor="weight">Peso (%)</label>
                                <input id="weight" className={`uk-input ${errors.weight ? 'uk-form-danger' : ''}`} type="number" step="1" {...register('weight')} />
                                {errors.weight && <p className="uk-text-danger uk-margin-small-top">{errors.weight.message}</p>}
                            </div>
                        </div>
                        <p className="uk-text-right uk-margin-top">
                            <button className="uk-button uk-button-default uk-modal-close" type="button">Cancelar</button>
                            <button className="uk-button uk-button-primary uk-margin-small-left" type="submit" disabled={isSaving}>
                                {isSaving ? <div data-uk-spinner="ratio:0.6" /> : 'Salvar'}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

const queryClient = new QueryClient();
export function ClassAssessmentsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ClassAssessments />
        </QueryClientProvider>
    );
}