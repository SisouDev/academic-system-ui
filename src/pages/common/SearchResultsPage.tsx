import { useSearchParams } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../services/api';

import { DataTable, type ColumnDef } from '../../components/datatable';

type PersonResult = { id: number; fullName: string; email: string; status: string; personType: string; };
type ApiResponse = {
    _embedded?: { personSummaryDtoList: PersonResult[] };
    page?: { totalElements: number };
}

const fetchSearchResults = async (query: string): Promise<ApiResponse> => {
    const response = await api.get('/api/v1/search', {
        params: {
            scope: 'PEOPLE',
            query: query,
            page: 0,
            size: 20
        }
    });
    return response.data;
};

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
        queryKey: ['searchResults', query],
        queryFn: () => fetchSearchResults(query),
        enabled: !!query,
    });

    const columns: ColumnDef<PersonResult>[] = [
        { key: 'fullName', label: 'Nome Completo' },
        { key: 'email', label: 'Email' },
        { key: 'personType', label: 'Tipo', render: (item) => <span className="uk-badge">{item.personType}</span> },
        { key: 'status', label: 'Status', render: (item) => <span className={`uk-label uk-label-${item.status === 'ACTIVE' ? 'success' : 'warning'}`}>{item.status}</span> },
    ];

    if (!query) {
        return <p className="uk-text-center uk-text-muted">Use a barra de busca no topo para encontrar pessoas no sistema.</p>
    }

    return (
        <div>
            <h2 className="uk-heading-divider">Resultados da Busca por: <span className="uk-text-primary">"{query}"</span></h2>
            <DataTable
                columns={columns}
                data={data?._embedded?.personSummaryDtoList ?? []}
                isLoading={isLoading}
                emptyMessage="Nenhum resultado encontrado para sua busca."
            />
            {isError && <div className="uk-alert-danger" data-uk-alert><p>Ocorreu um erro ao realizar a busca.</p></div>}
        </div>
    );
}

const queryClient = new QueryClient();
export function SearchResultsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchResults />
        </QueryClientProvider>
    );
}