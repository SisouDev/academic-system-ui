import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { FiEdit, FiPlus } from 'react-icons/fi';

type Course = {
    id: number;
    name: string;
    durationInSemesters: number;
    departmentName: string;
};

type ApiResponse = {
    _embedded?: { courseSummaryDtoList: Course[] };
};

const fetchCourses = async (searchTerm: string): Promise<Course[]> => {
    const response = await api.get<ApiResponse>('/api/v1/courses', {
        params: { searchTerm, size: 200 }
    });
    return response.data._embedded?.courseSummaryDtoList || [];
};


function CourseTable() {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ['courses', searchTerm],
        queryFn: () => fetchCourses(searchTerm),
    });

    const columns: ColumnDef<Course>[] = [
        { key: 'name', label: 'Nome do Curso' },
        {
            key: 'departmentName',
            label: 'Departamento',
            render: (course) => course.departmentName || 'N/A'
        },
        {
            key: 'durationInSemesters',
            label: 'Duração',
            render: (course) => `${course.durationInSemesters} semestres`
        },
    ];

    const renderActions = (course: Course) => (
        <div className="actions-cell">
            <Link to={`/admin/courses/edit/${course.id}`}>
                <button className="uk-button uk-button-default uk-button-small" title="Editar Curso">
                    <FiEdit />
                </button>
            </Link>
        </div>
    );

    return (
        <div className="page-content-card">
            {isError && <div className="uk-alert-danger" data-uk-alert><p>Erro ao carregar os cursos.</p></div>}
            <DataTable
                columns={columns}
                data={courses || []}
                renderActions={renderActions}
                isLoading={isLoading}
                emptyMessage="Nenhum curso encontrado."
            />
        </div>
    );
}


const queryClient = new QueryClient();

export function CourseListPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <header className="page-header">
                    <h1 className="uk-heading-medium">Gerenciamento de Cursos</h1>
                    <Link to="/admin/courses/novo" className="uk-button uk-button-primary">
                        <FiPlus className="uk-margin-small-right" />
                        Novo Curso
                    </Link>
                </header>
                <CourseTable />
            </div>
        </QueryClientProvider>
    );
}