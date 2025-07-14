export type TeacherCourseSection = {
    id: number;
    subjectId: number;
    name: string;
    subjectName: string;
    courseName: string;
    departmentName: string;
    academicTermName: string;
    room: string;
    studentCount: number;
    status: string;
    hasNewActivity: boolean;
};

export type ClassListStudent = {
    enrollmentId: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    averageGradeInSection: number | null;
};


export type HateoasCollection<T> = {
    _embedded: {
        [key: string]: T[];
    };
};

export type CourseSectionDetailsForTeacher = {
    id: number;
    subjectId: number;
    sectionName: string;
    subjectName: string;
    lessonCount: number;
    studentCount: number;
    pendingAssessmentsCount: number;
    lessonPlanId: number | null;
    enrolledStudents: ClassListStudent[];
};