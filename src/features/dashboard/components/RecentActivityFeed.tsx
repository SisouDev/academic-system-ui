import { Card, ListGroup } from 'react-bootstrap';
import { UserPlus, BookUp, Bell } from 'lucide-react';

import type { ActivityFeedItem } from '../../../types';

const getActivityIcon = (type: string) => {
    switch(type) {
        case 'NEW_STUDENT': return <UserPlus size={20} className="text-success" />;
        case 'NEW_COURSE': return <BookUp size={20} className="text-primary" />;
        default: return <Bell size={20} className="text-secondary" />;
    }
}

export const RecentActivityFeed = ({ activities }: { activities: ActivityFeedItem[] }) => (
    <Card className="shadow-sm">
        <Card.Header as="h5">Atividades Recentes</Card.Header>
        <ListGroup variant="flush">
            {activities?.length > 0 ? (
                activities.map((activity: ActivityFeedItem, index: number) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                        <div className="me-3">{getActivityIcon(activity.type)}</div>
                        <div>
                            {activity.description}
                            <small className="d-block text-muted">
                                {new Date(activity.timestamp).toLocaleString('pt-BR')}
                            </small>
                        </div>
                    </ListGroup.Item>
                ))
            ) : (
                <ListGroup.Item>Nenhuma atividade recente.</ListGroup.Item>
            )}
        </ListGroup>
    </Card>
);