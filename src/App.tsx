import {Route, Routes} from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage.tsx';
import { Dashboard } from './pages/Dashboard';
import { StudentListPage } from './pages/student/StudentListPage.tsx';
import { CourseDetailsPage } from './pages/course/CourseDetailsPage.tsx';
import { StudentFormPage } from './pages/student/StudentFormPage.tsx';
import {TeacherFormPage} from "./pages/admin/teacher/TeacherFormPage.tsx";
import {ProfilePage} from "./pages/profile/ProfilePage.tsx";
import {AdminDashboardPage} from "./pages/admin/AdminDashboardPage.tsx";
import {UnauthorizedPage} from "./pages/UnauthorizedPage.tsx";
import {EmployeeListPage} from "./pages/admin/employee/EmployeeListPage.tsx";
import {Header} from "./components/header/Header.tsx";
import {RecentActivityPage} from "./pages/admin/RecentActivityPage.tsx";
import {SearchResultsPage} from "./pages/common/SearchResultsPage.tsx";
import {MyProfileEditPage} from "./pages/profile/MyProfileEditPage.tsx";
import {EmployeeFormPage} from "./pages/admin/employee/EmployeeFormPage.tsx";
import {TeacherListPage} from "./pages/admin/teacher/TeacherListPage.tsx";
import {CourseListPage} from "./pages/admin/course/CourseListPage.tsx";
import {CourseFormPage} from "./pages/admin/course/CourseFormPage.tsx";
import {MyClassesPage} from "./pages/teacher/MyClassesPage.tsx";
import {LessonPlanPage} from "./pages/teacher/LessonPlanPage.tsx";
import {ClassDetailsPage} from "./pages/teacher/ClassDetailsPage.tsx";
import {GradebookPage} from "./pages/teacher/GradebookPage.tsx";
import {ClassAssessmentsPage} from "./pages/teacher/ClassAssessmentsPage.tsx";
import {StudentDashboardPage} from "./pages/student/StudentDashboardPage.tsx";
import {EnrollmentDetailsPage} from "./pages/student/EnrollmentDetailsPage.tsx";
import {DepartmentListPage} from "./pages/admin/department/DepartmentListPage.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>

                    <Route path="/" element={<Dashboard />} />
                    <Route path="perfil/:userId" element={<ProfilePage />} />
                    <Route path="me/edit" element={<MyProfileEditPage />} />
                    <Route path="cursos/:courseId" element={<CourseDetailsPage />} />
                    <Route path="search" element={<SearchResultsPage />} />

                    <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="admin/recent-activity" element={<RecentActivityPage />} />

                        <Route path="admin/employees" element={<EmployeeListPage />} />
                        <Route path="admin/employees/novo" element={<EmployeeFormPage />} />
                        <Route path="admin/employees/edit/:employeeId" element={<EmployeeFormPage />} />

                        <Route path="admin/students" element={<StudentListPage />} />
                        <Route path="admin/students/novo" element={<StudentFormPage />} />
                        <Route path="admin/students/edit/:studentId" element={<StudentFormPage />} />

                        <Route path="admin/teachers" element={<TeacherListPage />} />
                        <Route path="admin/teachers/novo" element={<TeacherFormPage />} />
                        <Route path="admin/teachers/edit/:teacherId" element={<TeacherFormPage />} />

                        <Route path="admin/courses" element={<CourseListPage />} />
                        <Route path="admin/courses/novo" element={<CourseFormPage />} />
                        <Route path="admin/courses/edit/:courseId" element={<CourseFormPage />} />

                        <Route path="admin/departments" element={<DepartmentListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="ROLE_STUDENT" />}>
                        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                        <Route path="/student/class/:enrollmentId/details" element={<EnrollmentDetailsPage />} />
                    </Route>

                    <Route element={<ProtectedRoute requiredRole="ROLE_TEACHER" />}>
                        <Route path="teacher/my-classes" element={<MyClassesPage />} />
                        <Route path="teacher/class/:courseSectionId/lesson-plan" element={<LessonPlanPage />} />
                        <Route path="teacher/class/:courseSectionId/students" element={<ClassDetailsPage />} />
                        <Route path="teacher/class/:courseSectionId/grades" element={<GradebookPage />} />
                        <Route path="teacher/class/:courseSectionId/assessments" element={<ClassAssessmentsPage/>} />
                    </Route>

                </Route>
            </Route>

            <Route path="*" element={
                <div>
                    <Header />
                    <h1 className="uk-text-center uk-padding">404 - Página Não Encontrada</h1>
                </div>
            } />
        </Routes>
    );
}