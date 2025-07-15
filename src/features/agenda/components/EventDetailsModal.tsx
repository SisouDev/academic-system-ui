import {Modal, Button, ListGroup, Badge, Spinner} from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/auth/api';
import type {AgendaItem, MeetingDetails, MeetingParticipant} from '../../../types';
import {useAuthContext} from "../../../contexts/auth/AuthContext.tsx";
import {formatMeetingStatus} from "../../../utils/formatters.ts";


interface EventDetailsModalProps {
    event: AgendaItem | null;
    show: boolean;
    onHide: () => void;
}

const SafeHtmlRenderer = ({ html }: { html: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: html || '' }} />;
};

const getMeetingDetails = async (meetingId?: number): Promise<MeetingDetails | null> => {
    if (!meetingId) return null;
    const { data } = await api.get(`/api/v1/meetings/${meetingId}`);
    return data;
};

const rsvpRequest = (data: { meetingId: number, status: string }) => {
    return api.patch(`/api/v1/meetings/${data.meetingId}/rsvp?status=${data.status}`);
};


export const EventDetailsModal = ({ event, show, onHide }: EventDetailsModalProps) => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    const { data: details, isLoading } = useQuery({
        queryKey: ['meetingDetails', event?.id],
        queryFn: () => getMeetingDetails(event?.id),
        enabled: !!event && event.isMeeting && show,
    });

    const { mutate: rsvp, isPending: isRsvping } = useMutation({
        mutationFn: rsvpRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['meetingDetails', event?.id] });
            await queryClient.invalidateQueries({ queryKey: ['agenda'] });
        }
    });

    if (!event) return null;

    const handleRsvp = (status: string) => {
        if (event) {
            rsvp({ meetingId: event.id, status });
        }
    };

    const myParticipation = details?.participants.find(p => p.participant.id === user?.personId);
    const myStatus = myParticipation?.status;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{event.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <SafeHtmlRenderer html={event.description} />
                </div>
                <hr/>
                {isLoading ? <div className="text-center"><Spinner /></div> : (
                    details && event.isMeeting ? (
                        <>
                            <h6>Participantes ({details.participants.length})</h6>
                            <ListGroup variant="flush" className="mb-3">
                                {details.participants.map((p: MeetingParticipant) => (
                                    <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                                        <span>
                                            {p.participant.fullName}
                                            {p.participant.id === details.organizer.id && <Badge bg="secondary-subtle" text="dark" pill className="ms-2">Organizador</Badge>}
                                        </span>
                                        <Badge bg="primary-subtle" text="primary-emphasis">{formatMeetingStatus(p.status)}</Badge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <h6>Sua Resposta</h6>
                            <div className="d-flex gap-2">
                                <Button size="sm" variant={myStatus === 'ACCEPTED' ? 'success' : 'outline-success'} onClick={() => handleRsvp('ACCEPTED')} disabled={isRsvping}>Aceitar</Button>
                                <Button size="sm" variant={myStatus === 'TENTATIVE' ? 'warning' : 'outline-warning'} onClick={() => handleRsvp('TENTATIVE')} disabled={isRsvping}>Talvez</Button>
                                <Button size="sm" variant={myStatus === 'DECLINED' ? 'danger' : 'outline-danger'} onClick={() => handleRsvp('DECLINED')} disabled={isRsvping}>Recusar</Button>
                            </div>
                        </>
                    ) : <p>Este é um evento geral do calendário.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};