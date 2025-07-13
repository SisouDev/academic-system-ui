export type Grade = {
    assessmentId: number | null;
    score: number | null;
};

export type AssessmentHeader = {
    definitionId: number;
    title: string;
    type: string;
    date: string;
    weight: number;
};

export type GradebookStudent = {
    studentId: number;
    enrollmentId: number;
    studentName: string;
    grades: Record<string, Grade>;
};

export type GradebookData = {
    headers: AssessmentHeader[];
    studentRows: GradebookStudent[];
};

export type CreateAssessmentDefinitionData = {
    courseSectionId: number;
    title: string;
    type: string;
    assessmentDate: string;
    weight: number;
}