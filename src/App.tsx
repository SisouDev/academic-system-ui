import { Routes, Route } from 'react-router-dom';

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

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>

                <Route path="/" element={<DashboardLayout />}>

                    <Route index element={<Dashboard />} />
                    <Route path="alunos" element={<StudentListPage />} />
                    <Route path="alunos/novo" element={<StudentFormPage />} />
                    <Route path="alunos/editar/:studentId" element={<StudentFormPage />} />
                    <Route path="professores" element={<TeacherListPage />} />
                    <Route path="professores/novo" element={<TeacherFormPage />} />
                    <Route path="professores/editar/:teacherId" element={<TeacherFormPage />} />
                    <Route path="perfil/:userId" element={<ProfilePage />} />
                    <Route path="cursos/:courseId" element={<CourseDetailsPage />} />

                </Route>
            </Route>

            <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Routes>
    );
}