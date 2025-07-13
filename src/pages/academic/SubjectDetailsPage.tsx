import { useParams } from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { Alert, Spinner, Button, Modal, Accordion } from 'react-bootstrap';
import api from '../../services/auth/api';
import {Calendar, PenSquare, PlusCircle, Trash2} from 'lucide-react';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import { useState } from 'react';
import { AddLessonContentForm } from '../../features/lessons/components/AddLessonContentForm';
import type { SubjectDetails, Lesson, LessonContent } from '../../types';
import {CreateLessonForm} from "../../features/lessons/components/CreateLessonForm.tsx";
import {ConfirmationModal} from "../../components/common/ConfirmationModal.tsx";

const getSubjectDetails = async (subjectId?: string): Promise<SubjectDetails> => {
    if (!subjectId) throw new Error("ID da matéria não fornecido.");
    const { data } = await api.get(`/api/v1/subjects/${subjectId}/details`);
    return data;
};

const deleteLessonRequest = (lessonId: number) => api.delete(`/api/v1/lessons/${lessonId}`);


const SafeHtmlRenderer = ({ html }: { html: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function SubjectDetailsPage() {
    const { subjectId } = useParams<{ subjectId: string }>();
    const { user } = useAuthContext();
    const isTeacher = user?.roles.includes('ROLE_TEACHER');
    const queryClient = useQueryClient();

    const [modalState, setModalState] = useState<{ type: 'addContent' | 'createLesson' | 'deleteLesson' | null, lessonId?: number }>({ type: null });

    const { data: details, isLoading, isError, error } = useQuery({
        queryKey: ['subjectDetails', subjectId],
        queryFn: () => getSubjectDetails(subjectId),
        enabled: !!subjectId,
    });

    const { mutate: deleteLesson, isPending: isDeleting } = useMutation({
        mutationFn: deleteLessonRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjectDetails', subjectId] });
            handleCloseModal();
        },
    });

    const handleShowAddContentModal = (lessonId: number) => setModalState({ type: 'addContent', lessonId });
    const handleShowCreateLessonModal = () => setModalState({ type: 'createLesson' });
    const handleShowDeleteModal = (lessonId: number) => setModalState({ type: 'deleteLesson', lessonId });
    const handleCloseModal = () => setModalState({ type: null });

    const confirmDelete = () => {
        if (modalState.lessonId) {
            deleteLesson(modalState.lessonId);
        }
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar detalhes da matéria: {error.message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>{details?.subjectName}</h1>
                    <p className="text-muted mb-0">{details?.courseSectionName}</p>
                </div>
                {isTeacher && (
                    <Button onClick={handleShowCreateLessonModal}>
                        <PlusCircle size={18} className="me-2" />
                        Criar Nova Aula
                    </Button>
                )}
            </div>

            <h3 className="mb-3">Aulas e Conteúdos</h3>

            <Accordion alwaysOpen defaultActiveKey="0">
                {details?.lessons && details.lessons.length > 0 ? (
                    details.lessons.map((lesson: Lesson, index: number) => (
                        <Accordion.Item eventKey={String(index)} key={lesson.id}>
                            <Accordion.Header>
                                <div className="d-flex w-100 justify-content-between align-items-center me-2">
                                    <span><Calendar className="me-2" size={18} />{new Date(lesson.lessonDate + 'T00:00:00').toLocaleDateString('pt-BR')} - <strong>{lesson.topic}</strong></span>
                                    {isTeacher && (
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={(e) => { e.stopPropagation(); handleShowAddContentModal(lesson.id); }}>
                                                <PenSquare size={16} />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); handleShowDeleteModal(lesson.id); }}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {lesson.description || lesson.contents?.length > 0 ? (
                                    <>
                                        {lesson.description && (
                                            <div className="text-muted fst-italic border-bottom pb-3 mb-3">
                                                <SafeHtmlRenderer html={lesson.description} />
                                            </div>
                                        )}

                                        {lesson.contents?.map((content: LessonContent) => (
                                            <div key={content.id} className="content-block border-start border-4 ps-3 mb-3">
                                                <SafeHtmlRenderer html={content.content} />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p>Nenhum conteúdo adicionado para esta aula ainda.</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                ) : (<Alert variant="info">Nenhuma aula foi registrada para esta matéria ainda.</Alert>)}
            </Accordion>

            <Modal show={modalState.type === 'addContent'} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton><Modal.Title>Adicionar Conteúdo à Aula</Modal.Title></Modal.Header>
                <Modal.Body>
                    <AddLessonContentForm lessonId={modalState.lessonId!} onDone={handleCloseModal} />
                </Modal.Body>
            </Modal>


            <Modal show={modalState.type === 'createLesson'} onHide={handleCloseModal}>
                <Modal.Header closeButton><Modal.Title>Criar Nova Aula</Modal.Title></Modal.Header>
                <Modal.Body>
                    <CreateLessonForm courseSectionId={details?.courseSectionId} onDone={handleCloseModal} />
                </Modal.Body>
            </Modal>
            <ConfirmationModal
                show={modalState.type === 'deleteLesson'}
                onHide={handleCloseModal}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                body={`Você tem certeza que deseja apagar a aula "${details?.lessons.find(l => l.id === modalState.lessonId)?.topic}"? Esta ação não pode ser desfeita.`}
                confirmButtonText="Sim, apagar aula"
                isConfirming={isDeleting}
            />
        </div>
    );
}