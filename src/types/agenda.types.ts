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

export interface CreateCalendarEventData {
    title: string;
    description: string;
    type: 'MEETING' | 'ACADEMIC_EVENT' | 'HOLIDAY' | 'OTHER';
    startTime: string;
    endTime: string;
    scope: 'INSTITUTION' | 'DEPARTMENT';
    targetDepartmentId?: number | null;
}


export interface DepartmentSelection {
    id: number;
    name: string;
}