import { Routes, Route } from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/auth/LoginPage.tsx';
import { Dashboard } from './pages/Dashboard';
import { StudentListPage } from './pages/student/StudentListPage.tsx';


export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="alunos" element={<StudentListPage />} />
                </Route>
            </Route>

            <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Routes>
    );
}