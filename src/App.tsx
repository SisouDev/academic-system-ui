import {Route, BrowserRouter} from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage.tsx';
import { Dashboard } from './pages/Dashboard';
import { StudentListPage } from './pages/student/StudentListPage.tsx';
import { CourseDetailsPage } from './pages/course/CourseDetailsPage.tsx';
import { StudentFormPage } from './pages/student/StudentFormPage.tsx';
import {TeacherListPage} from "./pages/teacher/TeacherListPage.tsx";
import {TeacherFormPage} from "./pages/teacher/TeacherFormPage.tsx";
import {ProfilePage} from "./pages/profile/ProfilePage.tsx";
import {AdminDashboardPage} from "./pages/admin/AdminDashboardPage.tsx";
import {UnauthorizedPage} from "./pages/UnauthorizedPage.tsx";
import {EmployeeListPage} from "./pages/admin/EmployeeListPage.tsx";
import {Header} from "./components/header/Header.tsx";
import {Toaster} from "react-hot-toast";

export default function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    success: { duration: 3000, style: { background: '#2ecc71', color: 'white' } },
                    error: { duration: 5000, style: { background: '#e74c3c', color: 'white' } },
                }}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="alunos" element={<StudentListPage />} />
                    <Route path="alunos/novo" element={<StudentFormPage />} />
                    <Route path="alunos/editar/:studentId" element={<StudentFormPage />} />
                    <Route path="professores" element={<TeacherListPage />} />
                    <Route path="professores/novo" element={<TeacherFormPage />} />
                    <Route path="professores/editar/:teacherId" element={<TeacherFormPage />} />
                    <Route path="perfil/:userId" element={<ProfilePage />} />
                    <Route path="cursos/:courseId" element={<CourseDetailsPage />} />

                <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/employees" element={<EmployeeListPage />} />
                </Route>
                </Route>
            </Route>

            <Route path="*" element={
                <div>
                    <Header />
                    <h1>404 - Página Não Encontrada</h1>
                </div>
            } />
        </BrowserRouter>
    );
}