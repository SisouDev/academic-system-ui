export type EnrolledSubject = {
    id: number;
    subjectId: number;
    status: string;
    totalAbsences: number;
    courseSectionInfo: {
        id: number;
        sectionName: string;
        subjectName: string;
        courseName: string;
    };
    teacher: {
        id: number;
        fullName: string;
    };
};
export type HateoasResponse<T> = {
    _embedded: {
        [key: string]: T[];
    };
};

