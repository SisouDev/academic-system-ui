import {Routes, Route, Navigate, useLocation} from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { useAuthContext } from './contexts/auth/AuthContext';
import {AnimatePresence} from "framer-motion";
import {AppLayout} from "./components/layout/AppLayout.tsx";
import MySubjectsPage from "./pages/academic/MySubjectsPage.tsx";
import SubjectDetailsPage from "./pages/academic/SubjectDetailsPage.tsx";
import MyClassesPage from "./pages/academic/MyClassesPage.tsx";
import CourseSectionDetailPage from './pages/academic/CourseSectionDetailPage.tsx';
import LessonPlanPage from "./pages/academic/LessonPlansPage.tsx";
import SectionAnnouncementsPage from "./pages/academic/SectionAnnouncementsPage.tsx";

function App() {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<h1>403 - Acesso Negado</h1>} />
                <Route element={<AppLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/my-subjects" element={<MySubjectsPage />} />
                        <Route path="/subjects/:subjectId" element={<SubjectDetailsPage />} />
                        <Route path="/my-classes" element={<MyClassesPage />} />
                        <Route path="/my-classes/:id" element={<CourseSectionDetailPage />} />
                        <Route path="/lesson-plans/section/:sectionId" element={<LessonPlanPage />} />
                        <Route path="/announcements/section/:sectionId" element={<SectionAnnouncementsPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;