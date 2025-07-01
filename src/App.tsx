import {Route, Routes} from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage.tsx';
import { Dashboard } from './pages/Dashboard';
import { StudentListPage } from './pages/student/StudentListPage.tsx';
import { CourseDetailsPage } from './pages/course/CourseDetailsPage.tsx';
import { StudentFormPage } from './pages/student/StudentFormPage.tsx';
import {TeacherFormPage} from "./pages/admin/TeacherFormPage.tsx";
import {ProfilePage} from "./pages/profile/ProfilePage.tsx";
import {AdminDashboardPage} from "./pages/admin/AdminDashboardPage.tsx";
import {UnauthorizedPage} from "./pages/UnauthorizedPage.tsx";
import {EmployeeListPage} from "./pages/admin/EmployeeListPage.tsx";
import {Header} from "./components/header/Header.tsx";
import {RecentActivityPage} from "./pages/admin/RecentActivityPage.tsx";
import {SearchResultsPage} from "./pages/common/SearchResultsPage.tsx";
import {MyProfileEditPage} from "./pages/profile/MyProfileEditPage.tsx";
import {EmployeeFormPage} from "./pages/admin/EmployeeFormPage.tsx";
import {TeacherListPage} from "./pages/admin/TeacherListPage.tsx";

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