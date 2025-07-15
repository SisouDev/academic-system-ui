import type { PersonSummary } from './index';

export type ApiAgendaItem = {
    id: number;
    title: string;
    description: string;
    start: string;
    end: string;
    type: string;
    isMeeting: boolean;
};

export type AgendaItem = {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    type: string;
    isMeeting: boolean;
    resource?: ApiAgendaItem;
};


export type MeetingParticipant = {
    id: number;
    participant: PersonSummary;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
};

export type MeetingDetails = {
    id: number;
    title: string;
    description: string;
    start: string;
    end: string;
    organizer: PersonSummary;
    participants: MeetingParticipant[];
    myStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
};

export type CreateMeetingData = {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    participantIds: number[];
};