import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '../../components/pageheader';
import UIkit from 'uikit';


type AssessmentDefinition = {
    id: number;
    title: string;
    type: string;
    assessmentDate: string;
    weight: number;
};

type FormInputs = {
    id?: number;
    title: string;
    type: string;
    assessmentDate: string;
    weight: number;
};

type ApiResponse = {
    _embedded?: { assessmentDefinitionDtoList: AssessmentDefinition[] };
};

const fetchAssessmentDefinitions = async (courseSectionId: string): Promise<AssessmentDefinition[]> => {
    const response = await api.get<ApiResponse>(`/api/v1/assessment-definitions?courseSectionId=${courseSectionId}`);
    return response.data._embedded?.assessmentDefinitionDtoList || [];
};

const saveAssessmentDefinition = ({ courseSectionId, data }: { courseSectionId: string, data: FormInputs }) => {
    if (data.id) {
        return api.put(`/api/v1/assessment-definitions/${data.id}`, data);
    }
    const payload = { ...data, courseSectionId: Number(courseSectionId) };
    return api.post('/api/v1/assessment-definitions', payload);
};

const deleteAssessmentDefinition = async (id: number) => {
    await api.delete(`/api/v1/assessment-definitions/${id}`);
};


function ClassAssessments() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<FormInputs | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<FormInputs>();

    const { data: assessments, isLoading } = useQuery({
        queryKey: ['assessmentDefinitions', courseSectionId],
        queryFn: () => fetchAssessmentDefinitions(courseSectionId!),
        enabled: !!courseSectionId,
    });

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: saveAssessmentDefinition,
        onSuccess: () => {
            toast.success("Avaliação salva com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['assessmentDefinitions', courseSectionId] });
            setIsModalOpen(false); // Fecha o modal no sucesso
        },
        onError: () => toast.error("Erro ao salvar avaliação."),
    });

    const { mutate: deleteDef } = useMutation({
        mutationFn: deleteAssessmentDefinition,
        onSuccess: () => {
            toast.success("Avaliação deletada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['assessmentDefinitions', courseSectionId] });
        },
        onError: () => toast.error("Erro ao deletar avaliação."),
    });

    const openModal = (assessment: FormInputs | null = null) => {
        setEditingAssessment(assessment);
        if (assessment) {
            setValue('title', assessment.title);
            setValue('type', assessment.type);
            setValue('assessmentDate', assessment.assessmentDate);
            setValue('weight', assessment.weight);
        } else {
            reset({ title: '', type: 'EXAM', assessmentDate: '', weight: 0 });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        UIkit.modal.confirm('Tem certeza que deseja deletar esta avaliação?').then(() => {
            deleteDef(id);
        }, () => {});
    };

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        save({ courseSectionId: courseSectionId!, data: { id: editingAssessment?.id, ...data } });
    };

    return (
        <div className="page-container">
            <PageHeader title="Gerenciamento de Avaliações da Turma" />

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
                                <p className="uk-text-meta uk-margin-remove">Data: {asm.assessmentDate} - Peso: {asm.weight}</p>
                            </div>
                            <div className="uk-button-group">
                                <button className="uk-button uk-button-default uk-button-small" onClick={() => openModal(asm)}><FiEdit /></button>
                                <button className="uk-button uk-button-danger uk-button-small" onClick={() => handleDelete(asm.id)}><FiTrash2 /></button>
                            </div>
                        </li>
                    ))}
                </ul>
                {!isLoading && assessments?.length === 0 && <p>Nenhuma avaliação cadastrada para esta turma.</p>}
            </div>
            {isModalOpen && (
            <div id="assessment-form-modal" data-uk-modal>
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">{editingAssessment ? 'Editar Avaliação' : 'Nova Avaliação'}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="uk-margin">
                            <label className="uk-form-label">Título</label>
                            <input className="uk-input" {...register('title', { required: true })} />
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label">Tipo</label>
                            <select className="uk-select" {...register('type', { required: true })}>
                                <option value="EXAM">Prova</option>
                                <option value="QUIZ">Quiz</option>
                                <option value="ASSIGNMENT">Trabalho</option>
                                <option value="PROJECT">Projeto</option>
                                <option value="PARTICIPATION">Participação</option>
                            </select>
                        </div>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label">Data da Avaliação</label>
                                <input className="uk-input" type="date" {...register('assessmentDate')} />
                            </div>
                            <div className="uk-width-1-2@s">
                                <label className="uk-form-label">Peso (%)</label>
                                <input className="uk-input" type="number" step="0.01" {...register('weight', { valueAsNumber: true })} />
                            </div>
                        </div>
                        <p className="uk-text-right uk-margin-top">
                            <button className="uk-button uk-button-default uk-modal-close" type="button">Cancelar</button>
                            <button className="uk-button uk-button-primary uk-margin-small-left" type="submit" disabled={isSaving}>
                                {isSaving ? <div data-uk-spinner="ratio: 0.6"></div> : 'Salvar'}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
            )}
        </div>
    );
}

const queryClient = new QueryClient();
export function ClassAssessmentsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ClassAssessments />
        </QueryClientProvider>
    )
}