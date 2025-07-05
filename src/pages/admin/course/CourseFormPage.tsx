import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../../services/api.ts';
import { FiSave } from 'react-icons/fi';

type CourseFormData = {
    name: string;
    description: string;
    durationInSemesters: number;
    departmentId: number;
};

type Department = {
    id: number;
    name: string;
};

const fetchCourseDetails = async (courseId: string) => {
    const { data } = await api.get(`/api/v1/courses/${courseId}`);
    return { ...data, departmentId: data.department?.id };
};

const fetchDepartments = async (): Promise<Department[]> => {
    const response = await api.get('/api/v1/departments/all');
    return response.data._embedded?.departmentSummaryDtoList || [];
};

const saveCourse = ({ courseId, data }: { courseId?: string; data: CourseFormData }) => {
    if (courseId) {
        const payload = {
            name: data.name,
            description: data.description,
            durationInSemesters: data.durationInSemesters,
        };
        return api.put(`/api/v1/courses/${courseId}`, payload);
    } else {
        const createPayload = {
            name: data.name,
            description: data.description,
            durationInSemesters: data.durationInSemesters,
            departmentId: data.departmentId,
        };
        return api.post('/api/v1/courses', createPayload);
    }
};

function CourseForm() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!courseId;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>();

    const { data: courseData, isLoading: isLoadingCourse } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => fetchCourseDetails(courseId!),
        enabled: isEditing,
    });

    const { data: departments, isLoading: isLoadingDepts } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: fetchDepartments,
    });

    useEffect(() => {
        if (isEditing && courseData) {
            reset(courseData);
        }
    }, [courseData, isEditing, reset]);

    const { mutate: saveCourseMutation, isPending: isSaving } = useMutation({
        mutationFn: saveCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success(`Curso ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/admin/courses');
        },
        onError: () => toast.error('Ocorreu um erro ao salvar o curso.'),
    });

    const onSubmit: SubmitHandler<CourseFormData> = (formData) => {
        saveCourseMutation({ courseId, data: formData });
    };

    const isLoading = isLoadingCourse || isLoadingDepts;

    return (
        <div className="page-content-card">
            {isLoading ? (
                <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="uk-form-stacked">
                    <h3 className="uk-card-title">{isEditing ? `Editando: ${courseData?.name}` : 'Novo Curso'}</h3>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="name">Nome do Curso</label>
                        <div className="uk-form-controls">
                            <input
                                className={`uk-input ${errors.name ? 'uk-form-danger' : ''}`}
                                id="name"
                                {...register('name', { required: 'O nome do curso é obrigatório.' })}
                            />
                            {errors.name && <p className="uk-text-danger uk-margin-small-top">{errors.name.message}</p>}
                        </div>
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="description">Descrição</label>
                        <div className="uk-form-controls">
                            <textarea className="uk-textarea" id="description" rows={4} {...register('description')}></textarea>
                        </div>
                    </div>
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-1-2@s">
                            <label className="uk-form-label" htmlFor="durationInSemesters">Duração (semestres)</label>
                            <div className="uk-form-controls">
                                <input
                                    className={`uk-input ${errors.durationInSemesters ? 'uk-form-danger' : ''}`}
                                    id="durationInSemesters"
                                    type="number"
                                    {...register('durationInSemesters', { required: 'A duração é obrigatória.', valueAsNumber: true })}
                                />
                                {errors.durationInSemesters && <p className="uk-text-danger uk-margin-small-top">{errors.durationInSemesters.message}</p>}
                            </div>
                        </div>
                        <div className="uk-width-1-2@s">
                            <label className="uk-form-label" htmlFor="departmentId">Departamento</label>
                            <div className="uk-form-controls">
                                <select
                                    className={`uk-select ${errors.departmentId ? 'uk-form-danger' : ''}`}
                                    id="departmentId"
                                    {...register('departmentId', { required: !isEditing, valueAsNumber: true })}
                                    disabled={isEditing}
                                >
                                    <option value="">Selecione um departamento...</option>
                                    {departments?.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                {errors.departmentId && <p className="uk-text-danger uk-margin-small-top">A seleção de um departamento é obrigatória.</p>}
                                {isEditing && <p className="uk-text-meta uk-margin-small-top">O departamento de um curso não pode ser alterado.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="uk-margin-medium-top uk-text-right">
                        <Link to="/admin/courses" className="uk-button uk-button-default uk-margin-small-right">Cancelar</Link>
                        <button type="submit" className="uk-button uk-button-primary" disabled={isSaving}>
                            <FiSave className="uk-margin-small-right" />
                            {isSaving ? <div data-uk-spinner="ratio: 0.8"></div> : 'Salvar'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export function CourseFormPage() {
    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="uk-heading-medium">Gerenciamento de Cursos</h1>
            </header>
            <CourseForm />
        </div>
    );
}