import api from '../auth/api';
import type {
    EnrollmentSummary,
    EnrollmentDetails,
    AssessmentDefinition,
    CourseDetails,
    AnnouncementSummary, StudentTeacherNote, LessonSummary
} from '../../types';
import type { CollectionModel } from '../../types';

function extractFromCollection<T>(response: CollectionModel<T>): T[] {
    if (!response._embedded) {
        return [];
    }
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey] || [];
}

export const getMyEnrollments = async (): Promise<EnrollmentSummary[]> => {
    const response = await api.get<CollectionModel<EnrollmentSummary>>('/api/v1/students/me/enrollments');
    return extractFromCollection(response.data);
};

export const getEnrollmentDetails = async (enrollmentId: number): Promise<EnrollmentDetails> => {
    const { data } = await api.get<EnrollmentDetails>(`/api/v1/enrollments/${enrollmentId}`);
    return data;
};

export const getAssessmentDefinitions = async (courseSectionId: number): Promise<AssessmentDefinition[]> => {
    const response = await api.get<CollectionModel<AssessmentDefinition>>(`/api/v1/assessment-definitions?courseSectionId=${courseSectionId}`);
    return extractFromCollection(response.data);
};


export const getMyCourseDetails = async (): Promise<CourseDetails> => {
    const { data } = await api.get<CourseDetails>('/api/v1/students/me/course');
    return data;
};

export const getMyRecentLessons = async (): Promise<LessonSummary[]> => {
    const response = await api.get<CollectionModel<LessonSummary>>('/api/v1/students/me/lessons?page=0&size=10');
    return extractFromCollection(response.data);
};

export const getMyAnnouncements = async (): Promise<AnnouncementSummary[]> => {
    const response = await api.get<CollectionModel<AnnouncementSummary>>('/api/v1/announcements');
    return extractFromCollection(response.data);
};

export const getMyTeacherNotes = async (): Promise<StudentTeacherNote[]> => {
    const response = await api.get<CollectionModel<StudentTeacherNote>>('/api/v1/students/me/teacher-notes');
    return extractFromCollection(response.data);
};