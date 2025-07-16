import type { CourseSectionSummary } from '../types';
import type { PersonSummary } from '../types';

export interface Assessment {
    id: number;
    score: number | null;
    assessmentDate: string;
    type: string;
    title: string | null;
    assessmentDefinitionId: number;
    weight?: number;
}

export interface AssessmentDefinition {
    id: number;
    title: string;
    type: string;
    assessmentDate: string;
    weight: number;
}

export interface AttendanceRecord {
    id: number;
    date: string;
    wasPresent: boolean;
}

export interface EnrollmentSummary {
    id: number;
    status: string;
    courseSectionInfo: {
        id: number;
        sectionName: string;
        subjectName: string;
        courseName: string;
    };
    totalAbsences: number;
    teacher: {
        id: number;
        fullName: string;
    };
    _links: {
        self: { href: string };
        courseSectionDetails: { href: string };
    };
}

export interface EnrollmentDetails {
    id: number;
    enrollmentDate: string;
    status: string;
    totalAbsences: number;
    student: PersonSummary;
    courseSection: CourseSectionSummary;
    assessments: Assessment[];
    attendanceRecords: AttendanceRecord[];
}