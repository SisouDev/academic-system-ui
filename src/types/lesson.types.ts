export type LessonContent = {
    id: number;
    type: 'TEXT' | 'LINK' | 'IMAGE' | 'VIDEO_EMBED';
    content: string;
};

export type Lesson = {
    id: number;
    topic: string;
    description: string;
    lessonDate: string;
    contents: LessonContent[];
};

export type SubjectDetails = {
    subjectId: number;
    courseSectionId: number;
    subjectName: string;
    courseSectionName: string;
    teacherName: string;
    teacherEmail: string;
    lessons: Lesson[];
};

export interface LessonSummary {
    id: number;
    topic: string;
    lessonDate: string;
    subjectName: string;
}