import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { PageHeader } from '../../components/pageheader';
import axios from 'axios';

type LessonPlanFormData = {
    objectives: string;
    syllabusContent: string;
    bibliography: string;
};

const fetchLessonPlan = async (courseSectionId: string) => {
    try {
        const { data } = await api.get(`/api/v1/course-sections/${courseSectionId}/lesson-plan`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const saveLessonPlan = ({ courseSectionId, lessonPlanId, data }: { courseSectionId: string, lessonPlanId?: number, data: LessonPlanFormData }) => {
    if (lessonPlanId) {
        return api.put(`/api/v1/lesson-plans/${lessonPlanId}`, data);
    } else {
        const payload = { ...data, courseSectionId: Number(courseSectionId) };
        return api.post('/api/v1/lesson-plans', payload);
    }
};

function LessonPlanForm() {
    const { courseSectionId } = useParams<{ courseSectionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: lessonPlanData, isLoading } = useQuery({
        queryKey: ['lessonPlan', courseSectionId],
        queryFn: () => fetchLessonPlan(courseSectionId!),
        enabled: !!courseSectionId,
    });

    const { register, handleSubmit, reset } = useForm<LessonPlanFormData>();

    const isEditing = !!lessonPlanData;

    useEffect(() => {
        if (lessonPlanData) {
            reset(lessonPlanData);
        }
    }, [lessonPlanData, reset]);

    const { mutate: save, isPending: isSaving } = useMutation({
        mutationFn: saveLessonPlan,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lessonPlan', courseSectionId] });
            toast.success('Plano de Aula salvo com sucesso!');
        },
        onError: () => toast.error('Erro ao salvar o Plano de Aula.'),
    });

    const onSubmit: SubmitHandler<LessonPlanFormData> = (formData) => {
        save({ courseSectionId: courseSectionId!, lessonPlanId: lessonPlanData?.id, data: formData });
    };

    if (isLoading) return <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;

    return (
        <div className="page-content-card">
            <form onSubmit={handleSubmit(onSubmit)} className="uk-form-stacked">
                <fieldset className="uk-fieldset">
                    <div className="uk-margin">
                        <label className="uk-form-label">Objetivos</label>
                        <textarea className="uk-textarea" rows={5} {...register('objectives', { required: true })} />
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label">Conteúdo Programático</label>
                        <textarea className="uk-textarea" rows={10} {...register('syllabusContent')} />
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label">Bibliografia</label>
                        <textarea className="uk-textarea" rows={5} {...register('bibliography')} />
                    </div>
                    <div className="uk-margin uk-text-right">
                        <button type="button" className="uk-button uk-button-default" onClick={() => navigate('/teacher/my-classes')}>Voltar</button>
                        <button type="submit" className="uk-button uk-button-primary uk-margin-small-left" disabled={isSaving}>
                            <FiSave className="uk-margin-small-right" />
                            {isSaving ? 'Salvando...' : (isEditing ? 'Atualizar Plano' : 'Salvar Plano')}
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

const queryClient = new QueryClient();

export function LessonPlanPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <PageHeader title="Plano de Aula" />
                <LessonPlanForm />
            </div>
        </QueryClientProvider>
    );
}