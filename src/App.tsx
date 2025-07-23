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
import LeaveRequestManagementPage from "./pages/hr/LeaveRequestManagementPage.tsx";
import AbsenceManagementPage from "./pages/hr/AbsenceManagementPage.tsx";
import SupportTicketManagementPage from "./pages/it/SupportTicketManagementPage.tsx";
import LoanManagementPage from "./pages/library/LoanManagementPage.tsx";
import FineManagementPage from './pages/library/FineManagementPage.tsx';
import PayrollManagementPage from "./pages/finance/PayrollManagementPage.tsx";
import PurchaseOrderManagementPage from "./pages/finance/PurchaseOrderManagementPage.tsx";
import SalaryStructureManagementPage from "./pages/finance/SalaryStructureManagementPage.tsx";
import EmployeeListPage from "./pages/hr/EmployeeListPage.tsx";
import CreatePurchaseOrderPage from "./pages/finance/CreatePurchaseOrderPage.tsx";
import PurchaseRequestManagementPage from "./pages/finance/PurchaseRequestManagementPage.tsx";
import ReceivablesManagementPage from "./pages/finance/ReceivablesManagementPage.tsx";
import PayablesManagementPage from "./pages/finance/PayablesManagementPage.tsx";
import AssetManagementPage from "./pages/it/AssetManagementPage.tsx";

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

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_HR_ANALYST', 'ROLE_FINANCE_MANAGER', 'ROLE_FINANCE_ASSISTANT', 'ROLE_ADMIN']} />}>
                        <Route path="/hr/employees" element={<EmployeeListPage />} />
                        <Route path="/hr/leave-requests" element={<LeaveRequestManagementPage />} />
                        <Route path="/hr/absences" element={<AbsenceManagementPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_TECHNICIAN', 'ROLE_ADMIN']} />}>
                        <Route path="/it/support-tickets" element={<SupportTicketManagementPage />} />
                        <Route path="/it/assets" element={<AssetManagementPage />} />

                    </Route>

                    <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />


                    <Route element={<ProtectedRoute allowedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']} />}>
                        <Route path="/library/loans" element={<LoanManagementPage />} />
                        <Route path="/library/fines" element={<FineManagementPage />} />

                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_FINANCE_ASSISTANT', 'ROLE_ADMIN']} />}>
                        <Route path="/finance/purchase-orders/new" element={<CreatePurchaseOrderPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_FINANCE_ASSISTANT', 'ROLE_ADMIN']} />}>
                        <Route path="/finance/purchase-requests" element={<PurchaseRequestManagementPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_HR_ANALYST', 'ROLE_FINANCE_MANAGER', 'ROLE_FINANCE_ASSISTANT', 'ROLE_ADMIN']} />}>
                        <Route path="/finance/payroll" element={<PayrollManagementPage />} />
                        <Route path="/finance/purchase-orders" element={<PurchaseOrderManagementPage />} />
                        <Route path="/finance/salary-structures" element={<SalaryStructureManagementPage />} />
                        <Route path="/hr/employees" element={<EmployeeListPage />} />

                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ROLE_FINANCE_MANAGER', 'ROLE_ADMIN']} />}>
                        <Route path="/finance/receivables" element={<ReceivablesManagementPage />} />
                        <Route path="/finance/payables" element={<PayablesManagementPage />} />

                    </Route>

                </Route>


            </Routes>
        </AnimatePresence>
    );
}

export default App;