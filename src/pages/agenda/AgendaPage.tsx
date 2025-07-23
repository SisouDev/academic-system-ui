import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/auth/api';
import { Alert, Spinner, Button, Card } from 'react-bootstrap';
import { PlusCircle } from 'lucide-react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import type {AgendaItem, ApiAgendaItem, HateoasCollection} from '../../types';
import { EventDetailsModal } from '../../features/agenda/components/EventDetailsModal';
import { CreateMeetingModal } from '../../features/agenda/components/CreateMeetingModal';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import {formatEventType} from "../../utils/requests/components/formatters.ts";

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });


const getAgendaItems = async (date: Date): Promise<AgendaItem[]> => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const { data } = await api.get<HateoasCollection<ApiAgendaItem>>(`/api/v1/calendar/events/month?year=${year}&month=${month}`);

    if (!data || !data._embedded) {
        return [];
    }

    const embeddedKey = Object.keys(data._embedded)[0];
    const items = data._embedded[embeddedKey];

    return (items || []).map((item: ApiAgendaItem): AgendaItem => ({
        id: item.id,
        title: item.title,
        description: item.description,
        start: new Date(item.start),
        end: new Date(item.end),
        type: item.type,
        isMeeting: item.isMeeting,
        resource: item,
    }));
};


export default function AgendaPage() {
    const { user } = useAuthContext();
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<AgendaItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const canCreateMeeting = !user?.roles.includes('ROLE_STUDENT');

    const { data: events, isLoading, isError, error } = useQuery({
        queryKey: ['agenda', viewDate.getFullYear(), viewDate.getMonth()],
        queryFn: () => getAgendaItems(viewDate),
    });

    const eventStyleGetter = (event: AgendaItem) => {
        let backgroundColor = '#3174ad';
        switch (event.type) {
            case 'MEETING':
                backgroundColor = '#B0C4B1';
                break;
            case 'HOLIDAY':
                backgroundColor = '#EDAFB8';
                break;
            case 'DEADLINE':
                backgroundColor = '#f88379';
                break;
            case 'SCHOOL_EVENT':
                backgroundColor = '#6f42c1';
                break;
        }

        const style = {
            backgroundColor,
            color: '#333',
            borderRadius: '5px',
            border: 'none',
            display: 'block',
        };
        return { style };
    };

    if (isError) return <Alert variant="danger">Erro ao carregar agenda: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Minha Agenda</h1>
                {canCreateMeeting && (
                    <Button onClick={() => setShowCreateModal(true)}>
                        <PlusCircle size={18} className="me-2" />
                        Agendar Reunião
                    </Button>
                )}
            </div>

            <Card className="shadow-sm p-3" style={{ height: '75vh' }}>
                {isLoading && <div className="text-center p-5"><Spinner /></div>}
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                    messages={{ }}
                    onSelectEvent={(event) => setSelectedEvent(event as AgendaItem)}
                    onNavigate={(date) => setViewDate(date)}
                    eventPropGetter={eventStyleGetter}
                    tooltipAccessor={(event: AgendaItem) => `${formatEventType(event.type)}: ${event.title}`}
                />
            </Card>

            <EventDetailsModal
                event={selectedEvent}
                show={!!selectedEvent}
                onHide={() => setSelectedEvent(null)}
            />

            <CreateMeetingModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
            />
        </div>
    );
}