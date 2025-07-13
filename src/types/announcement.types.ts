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