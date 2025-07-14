export type TeacherNote = {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
    enrollmentId: number;
};

export type CreateTeacherNoteData = {
    enrollmentId: number;
    content: string;
};