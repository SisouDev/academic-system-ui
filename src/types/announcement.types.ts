export type AnnouncementSummary = {
    id: number;
    title: string;
    createdAt: string;
    createdByFullName: string;
};

export type CreateAnnouncementData = {
    title: string;
    content: string;
    scope: 'COURSE_SECTION';
    targetCourseSectionId: number;
    expiresAt?: string | null;
};

export type PersonSummary = {
    id: number;
    fullName: string;
    email: string;
};

export type DepartmentSummary = {
    id: number;
    name: string;
};


export type AnnouncementDetails = {
    id: number;
    title: string;
    content: string;
    scope: string;
    createdAt: string;
    expiresAt?: string;
    createdBy: PersonSummary;
    targetDepartment?: DepartmentSummary;
};

export type CreateAnnouncementDataAll = {
    title: string;
    content: string;
    scope: 'COURSE_SECTION' | 'DEPARTMENT' | 'INSTITUTION';
    targetCourseSectionId?: number;
    targetDepartmentId?: number;
    expiresAt?: string | null;
};