export interface CourseInfo {
    courseName: string;
    currentSemester: number;
    conclusionForecast: string;
}

export interface AcademicSummary {
    overallAverageScore: number | null;
    attendanceRate: number;
}

export interface UpcomingAssessmentInfo {
    title: string;
    subject: string;
    date: string;
}

export interface CalendarEventInfo {
    title: string;
    type: string;
    startTime: string;
}

export interface StudentDashboardData {
    courseInfo: CourseInfo;
    academicSummary: AcademicSummary;
    nextAssessment: UpcomingAssessmentInfo | null;
    upcomingEvents: CalendarEventInfo[];
}