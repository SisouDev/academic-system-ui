export type HalCollection<T> = {
    _embedded: {
        [key: string]: T[];
    };
};


export type InstitutionSummaryDto = {
    id: number;
    name: string;
};

export type DepartmentSummaryDto = {
    id: number;
    name: string;
    acronym: string;
};

export type CourseSummaryDto = {
    id: number;
    name: string;
    durationInSemesters: number;
};

export type SubjectSummaryDto = {
    id: number;
    name:string;
    workloadHours: number;
};

export type PersonResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
    personType: 'STUDENT' | 'TEACHER' | 'EMPLOYEE' | 'STAFF';
    institution: InstitutionSummaryDto;
};

export type UserResponse = {
    id: number;
    login: string;
    active: boolean;
    person: PersonResponse;
    roles: { id: number; name: string }[];
};

export type AuthenticatedUser = {
    id: number;
    login: string;
    fullName: string;
    roles: string[];
    institutionId: number;
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