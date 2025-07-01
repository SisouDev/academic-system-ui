import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';


type EmployeeFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobPosition: string;
};

type PersonDetailsDto = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobPosition: string;
};


const fetchEmployeeDetails = async (employeeId: string): Promise<PersonDetailsDto> => {
    const response = await api.get(`/api/v1/employees/${employeeId}`);
    return response.data;
};

const updateEmployee = async ({ id, data }: { id: string; data: EmployeeFormData }) => {
    const response = await api.put(`/api/v1/employees/${id}`, data);
    return response.data;
};


function EmployeeForm() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const isEditing = !!employeeId;

    const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
        queryKey: ['employeeDetails', employeeId],
        queryFn: () => fetchEmployeeDetails(employeeId!),
        enabled: isEditing,
    });

    const { register, handleSubmit, reset } = useForm<EmployeeFormData>();

    useEffect(() => {
        if (isEditing && employeeData) {
            reset(employeeData);
        }
    }, [employeeData, isEditing, reset]);

    const { mutate: saveEmployee, isPending: isSaving } = useMutation({
        mutationFn: updateEmployee,
        onSuccess: () => {
            toast.success('Funcionário atualizado com sucesso!');
            navigate('/admin/employees');
        },
        onError: () => {
            toast.error('Ocorreu um erro ao salvar as alterações.');
        }
    });

    const onSubmit: SubmitHandler<EmployeeFormData> = (formData) => {
        if (isEditing) {
            saveEmployee({ id: employeeId, data: formData });
        }
    };

    if (isLoadingEmployee) {
        return <div className="uk-text-center uk-padding"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="uk-form-stacked">
            <h1 className="uk-heading-medium">{isEditing ? `Editando: ${employeeData?.firstName || ''} ${employeeData?.lastName || ''}` : 'Novo Funcionário'}</h1>

            <div className="uk-grid-small" data-uk-grid>
                <div className="uk-width-1-2@s">
                    <label className="uk-form-label" htmlFor="firstName">Nome</label>
                    <input className="uk-input" id="firstName" type="text" {...register('firstName', { required: true })} />
                </div>
                <div className="uk-width-1-2@s">
                    <label className="uk-form-label" htmlFor="lastName">Sobrenome</label>
                    <input className="uk-input" id="lastName" type="text" {...register('lastName', { required: true })} />
                </div>
                <div className="uk-width-1-2@s">
                    <label className="uk-form-label" htmlFor="email">Email</label>
                    <input className="uk-input" id="email" type="email" {...register('email', { required: true })} />
                </div>
                <div className="uk-width-1-2@s">
                    <label className="uk-form-label" htmlFor="phone">Telefone</label>
                    <input className="uk-input" id="phone" type="text" {...register('phone')} />
                </div>
                <div className="uk-width-1-1">
                    <label className="uk-form-label" htmlFor="jobPosition">Cargo</label>
                    <input className="uk-input" id="jobPosition" type="text" {...register('jobPosition')} />
                </div>
            </div>

            <div className="uk-margin-medium-top">
                <button type="submit" className="uk-button uk-button-primary" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button type="button" className="uk-button uk-button-default uk-margin-small-left" onClick={() => navigate('/admin/employees')}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}


const queryClient = new QueryClient();

export function EmployeeFormPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <div className="page-content-card">
                    <EmployeeForm />
                </div>
            </div>
        </QueryClientProvider>
    );
}