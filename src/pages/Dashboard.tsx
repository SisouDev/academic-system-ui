import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/pageheader';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';

import { CourseInfoCard } from '../components/card/CourseInfoCard';

import type {
    HalCollection,
    DepartmentSummaryDto,
    CourseSummaryDto,
    SubjectSummaryDto,
    CourseWithSubjects
} from '../types/api';

const fetchGroupedSubjectsByInstitution = async (institutionId: number): Promise<CourseWithSubjects[]> => {
    const extractData = <T,>(response: { data?: HalCollection<T> }): T[] => {
        const embedded = response.data?._embedded;
        if (!embedded || Object.keys(embedded).length === 0) return [];
        const key = Object.keys(embedded)[0];
        return embedded[key] || [];
    };

    try {
        const deptsResponse = await api.get<HalCollection<DepartmentSummaryDto>>(`/api/v1/departments?institutionId=${institutionId}`);
        const departments = extractData(deptsResponse);
        if (departments.length === 0) return [];

        const coursePromises = departments.map(dept => api.get<HalCollection<CourseSummaryDto>>(`/api/v1/courses?departmentId=${dept.id}`));
        const coursesResponses = await Promise.all(coursePromises);
        const allCourses = coursesResponses.flatMap(extractData);
        if (allCourses.length === 0) return [];

        const groupedDataPromises = allCourses.map(async (course) => {
            const subjectsResponse = await api.get<HalCollection<SubjectSummaryDto>>(`/api/v1/subjects?courseId=${course.id}`);
            const subjects = extractData(subjectsResponse);
            return { id: course.id, name: course.name, subjects: subjects };
        });

        const groupedData = await Promise.all(groupedDataPromises);
        return groupedData.filter(course => course.subjects.length > 0);
    } catch (err) {
        console.error("Erro ao buscar dados agrupados:", err);
        throw new Error("Falha ao carregar dados do painel.");
    }
};

export function Dashboard() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const institutionId = user?.institutionId;

    const { data: groupedCourses, isLoading, isError } = useQuery({
        queryKey: ['groupedSubjects', institutionId],
        queryFn: () => fetchGroupedSubjectsByInstitution(institutionId!),
        enabled: !!institutionId && user?.roles.includes('ROLE_ADMIN'),
    });

    if (isAuthLoading) {
        return <div className="uk-text-center uk-padding-large"><div data-uk-spinner="ratio: 2"></div></div>;
    }

    const pageTitle = user ? `Bem-vindo(a), ${user.fullName}!` : 'Painel Principal';

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="uk-text-center uk-padding-large">
                    <div data-uk-spinner="ratio: 2"></div>
                    <p>Carregando cursos...</p>
                </div>
            );
        }
        if (isError) {
            return <div className="uk-alert-danger" data-uk-alert><p>Ocorreu um erro ao carregar os cursos.</p></div>;
        }
        if (groupedCourses && groupedCourses.length > 0) {
            const courseCards = groupedCourses.map(course => (
                <CourseInfoCard
                    key={course.id}
                    courseId={course.id}
                    courseName={course.name}
                    subjects={course.subjects.map(subject => ({ id: subject.id, name: subject.name }))}
                />
            ));

            return <div
                className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m"
                data-uk-grid
            >
                {courseCards.map((card, index) => (
                    <div key={index}>{card}</div>
                ))}
            </div>
        }
        return <div className="uk-text-center uk-padding-large"><p>Nenhum curso com disciplinas encontrado para esta instituição.</p></div>;
    };


    return (
        <div>
            <PageHeader title={pageTitle} />
            {renderContent()}
        </div>
    );
}