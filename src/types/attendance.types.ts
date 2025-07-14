export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'UNDEFINED';

export type ClassListStudentAtt = {
    enrollmentId: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    enrollmentStatus: string;
    todaysStatus: AttendanceStatus;

};