import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { FiClock } from 'react-icons/fi';

type ActivityLog = {
    description: string;
    userName: string;
    userEmail: string;
    timestamp: string;
};

const fetchRecentActivity = async (): Promise<ActivityLog[]> => {
    const response = await api.get('/api/v1/admin/recent-activity');
    return response.data;
};

export function RecentActivityFeed() {
    const { data, isLoading, isError } = useQuery<ActivityLog[], Error>({
        queryKey: ['recentActivity'],
        queryFn: fetchRecentActivity,
    });

    if (isLoading) return <div className="uk-text-center uk-padding-small"><div data-uk-spinner></div></div>;
    if (isError) return <p className="uk-text-danger">Não foi possível carregar a atividade recente.</p>;

    return (
        <div>
            <h3 className="uk-card-title uk-text-bold">Atividade Recente</h3>
            <ul className="uk-list uk-list-divider">
                {data?.map((log, index) => (
                    <li key={index} className="uk-flex uk-flex-middle">
                        <FiClock className="uk-margin-small-right uk-text-muted" />
                        <div>
                            <p className="uk-margin-remove-bottom uk-text-emphasis">{log.description}</p>
                            <span className="uk-text-meta">{log.userName} ({log.userEmail}) em {log.timestamp}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}