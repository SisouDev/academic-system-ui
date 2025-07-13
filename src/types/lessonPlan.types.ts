export type CourseSectionSummary = {
    id: number;
    name: string;
    subjectName: string;
};

export type LessonPlanData = {
    id: number | null;
    objectives: string;
    syllabusContent: string;
    bibliography: string;
    courseSection: CourseSectionSummary;
};


export type LessonPlanFormData = {
    courseSectionId: number;
    objectives: string;
    syllabusContent: string;
    bibliography: string;
};