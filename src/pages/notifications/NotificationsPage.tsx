import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/auth/api';
import type { Notification, HateoasCollection } from '../../types';
import { Bell, Check, AlertTriangle, Star, FileText, ClipboardCheck, Megaphone } from 'lucide-react';
import {format, parse} from "date-fns";
import {ptBR} from "date-fns/locale";

const getMyNotifications = async (): Promise<Notification[]> => {
    const { data } = await api.get<HateoasCollection<Notification>>('/api/v1/notifications/me');
    return data._embedded?.notificationDtoList || [];
};

const markAsReadRequest = (notificationId: number) => {
    return api.patch(`/api/v1/notifications/${notificationId}/read`);
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
    const queryClient = useQueryClient();

    const { mutate: markAsRead, isPending } = useMutation({
        mutationFn: markAsReadRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const getNotificationIcon = (type: string) => {
        switch(type) {
            case 'GRADE_POSTED': return <Star className="text-warning" />;
            case 'NEW_ANNOUNCEMENT': return <Megaphone className="text-info" />;
            case 'NEW_CONTENT': return <FileText className="text-primary" />;
            case 'TASK_ASSIGNED': return <ClipboardCheck className="text-success" />;
            case 'INVITATION': return <Bell className="text-primary" />;
            case 'SECURITY_ALERT': return <AlertTriangle className="text-danger" />;
            default: return <Bell className="text-secondary" />;
        }
    };

    return (
        <Card className={`mb-3 shadow-sm ${notification.status === 'UNREAD' ? 'border-primary' : 'border-light'}`}>
            <Card.Body>
                <div className="d-flex align-items-start">
                    <div className="me-3 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-grow-1">
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">{format(
                            parse(notification.createdAt, 'dd/MM/yyyy HH:mm', new Date()),
                            'Pp',
                            { locale: ptBR }
                        )}</small>
                    </div>
                    <div className="ms-3 d-flex flex-column align-items-end gap-2">
                        <Link to={notification.link} className="btn btn-outline-primary btn-sm">Ver</Link>
                        {notification.status === 'UNREAD' && (
                            <Button variant="light" size="sm" onClick={() => markAsRead(notification.id)} disabled={isPending}>
                                {isPending ? <Spinner size="sm" /> : <><Check size={16} /> Marcar como lida</>}
                            </Button>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};


export default function NotificationsPage() {
    const { data: notifications, isLoading, isError, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: getMyNotifications,
    });

    const unreadCount = notifications?.filter(n => n.status === 'UNREAD').length || 0;

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar notificações: {(error as Error).message}</Alert>;

    return (
        <div>
            <h1 className="mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Minhas Notificações</h1>
            {unreadCount > 0 && (
                <Alert variant="info">Você tem <strong>{unreadCount}</strong> notificações não lidas.</Alert>
            )}

            <div>
                {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                ) : (
                    <Alert variant="secondary" className="text-center">Você não tem nenhuma notificação.</Alert>
                )}
            </div>
        </div>
    );
}