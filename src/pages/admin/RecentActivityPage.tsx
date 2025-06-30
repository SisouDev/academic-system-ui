import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecentActivityFeed } from '../../components/admin/RecentActivityFeed';

const queryClient = new QueryClient();

export function RecentActivityPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="page-container">
                <header className="page-header">
                    <h1 className="uk-heading-medium">Atividade Recente do Sistema</h1>
                </header>
                <div className="page-content-card">
                    <RecentActivityFeed />
                </div>
            </div>
        </QueryClientProvider>
    );
}