import type {DepartmentSummaryDto} from './institution.types';

export type SubjectSummaryDto = {
    id: number;
    name: string;
    workloadHours: number;
};

export type CourseSummaryDto = {
    id: number;
    name: string;
    durationInSemesters: number;
};

export type CourseWithSubjects = {
    id: number;
    name: string;
    subjects: SubjectSummaryDto[];
};

export type CourseDetailsDto = {
    id: number;
    name: string;
    description: string;
    durationInSemesters: number;
    department: DepartmentSummaryDto;
    subjects: SubjectSummaryDto[];
};

export interface CourseSubject {
    subjectId: number;
    subjectName: string;
    semester: number;
}

export interface CourseDetails {
    id: number;
    name: string;
    description: string;
    durationInSemesters: number;
    subjects: CourseSubject[];
}