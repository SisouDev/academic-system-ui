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
import AnnouncementDetailPage from "./pages/announcements/AnnouncementDetailPage.tsx";
import GradebookPage from "./pages/academic/GradebookPage.tsx";
import SectionAttendancePage from "./pages/academic/SectionAttendancePage.tsx";
import TeacherNotesPage from "./pages/academic/TeacherNotesPage.tsx";
import AllMyStudentsPage from "./pages/academic/AllMyStudentsPage.tsx";
import InternalRequestsPage from "./pages/requests/InternalRequestsPage.tsx";
import CreateRequestPage from "./pages/requests/CreateRequestPage.tsx";
import MyTasksPage from "./pages/tasks/MyTasksPage.tsx";
import MySupportTicketsPage from "./pages/support/MySupportTicketsPage.tsx";
import CreateSupportTicketPage from "./pages/support/CreateSupportTicketPage.tsx";
import AgendaPage from "./pages/agenda/AgendaPage.tsx";
import NotificationsPage from "./pages/notifications/NotificationsPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import UserProfilePage from "./pages/users/UserProfilePage.tsx";
import MyGradesPage from "./pages/student/MyGradesPage.tsx";
import MyAttendancePage from "./pages/student/MyAttendancePage.tsx";
import MyCoursePage from "./pages/student/MyCoursePage.tsx";

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
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/users/:userId" element={<UserProfilePage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/internal-requests" element={<InternalRequestsPage />} />
                        <Route path="/requests/new" element={<CreateRequestPage />} />
                        <Route path="/my-tasks" element={<MyTasksPage />} />
                        <Route path="/my-support-tickets" element={<MySupportTicketsPage />} />
                        <Route path="/support/new" element={<CreateSupportTicketPage />} />
                        <Route path="/agenda" element={<AgendaPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
                        <Route path="/grades" element={<MyGradesPage />} />
                        <Route path="/attendance" element={<MyAttendancePage />} />
                        <Route path="/my-subjects" element={<MySubjectsPage />} />
                        <Route path="/subjects/:subjectId" element={<SubjectDetailsPage />} />
                        <Route path="/my-course" element={<MyCoursePage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_TEACHER']} />}>
                        <Route path="/my-classes" element={<MyClassesPage />} />
                        <Route path="/my-classes/:id" element={<CourseSectionDetailPage />} />
                        <Route path="/lesson-plans/section/:sectionId" element={<LessonPlanPage />} />
                        <Route path="/announcements/section/:sectionId" element={<SectionAnnouncementsPage />} />
                        <Route path="/gradebook/section/:sectionId" element={<GradebookPage />} />
                        <Route path="/attendance/section/:sectionId" element={<SectionAttendancePage />} />
                        <Route path="/teacher-notes/enrollment/:enrollmentId" element={<TeacherNotesPage />} />
                        <Route path="/my-classes/students" element={<AllMyStudentsPage />} />
                    </Route>

                </Route>

                <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;