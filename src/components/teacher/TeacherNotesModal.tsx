import React, {useEffect, useRef} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../../services/api.ts';
import { toast } from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';
import UIkit from "uikit";

type Note = {
    id: number;
    content: string;
    authorName: string;
    createdAt: string;
};


type ApiResponse = {
    _embedded?: {
        teacherNoteDtoList: Note[];
    };
};

type NewNoteFormData = { content: string; };

const fetchNotes = async (enrollmentId: number): Promise<Note[]> => {
    const response = await api.get<ApiResponse>(`/api/v1/teacher-notes?enrollmentId=${enrollmentId}`);
    return response.data._embedded?.teacherNoteDtoList || [];
};

const createNote = async ({ enrollmentId, content }: { enrollmentId: number, content: string }) => {
    await api.post('/api/v1/teacher-notes', { enrollmentId, content });
};


interface TeacherNotesModalProps {
    enrollmentId: number | null;
    studentName: string | null;
    onClose: () => void;
}

export const TeacherNotesModal: React.FC<TeacherNotesModalProps> = ({ enrollmentId, studentName, onClose }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<NewNoteFormData>();
    const modalRef = useRef<HTMLDivElement>(null);

    const { data: notes, isLoading } = useQuery({
        queryKey: ['teacherNotes', enrollmentId],
        queryFn: () => fetchNotes(enrollmentId!),
        enabled: !!enrollmentId,
    });

    const { mutate: addNote, isPending: isAdding } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            toast.success("Anotação adicionada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['teacherNotes', enrollmentId] });
            reset();
        },
        onError: () => toast.error("Erro ao adicionar anotação."),
    });

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {

            const handleBeforeHide = () => {
                console.log("Modal está prestes a fechar, chamando onClose...");
                onClose();
            };

            UIkit.util.on(modalElement, 'beforehide', handleBeforeHide);

            return () => {
                UIkit.util.off(modalElement, 'beforehide', handleBeforeHide);
            };
        }
    }, [onClose]);

    const onSubmit: SubmitHandler<NewNoteFormData> = (data) => {
        if (enrollmentId) {
            addNote({ enrollmentId, content: data.content });
        }
    };


    return (
        <div id="notes-modal" data-uk-modal ref={modalRef}>
            <div className="uk-modal-dialog uk-modal-body">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <h2 className="uk-modal-title">Anotações sobre {studentName}</h2>

                <div className="uk-margin" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {isLoading && <div className="uk-text-center"><div data-uk-spinner></div></div>}
                    <ul className="uk-list uk-list-divider">
                        {notes && notes.length > 0 ? (
                            notes.map(note => (
                                <li key={note.id}>
                                    <p className="uk-margin-remove">{note.content}</p>
                                    <p className="uk-text-meta uk-margin-remove">Por {note.authorName} em {note.createdAt}</p>
                                </li>
                            ))
                        ) : (
                            !isLoading && <li>Nenhuma anotação encontrada.</li>
                        )}
                    </ul>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Nova Anotação</legend>
                        <div className="uk-margin">
                            <textarea className="uk-textarea" rows={3} placeholder="Escreva sua observação..." {...register('content', { required: true })} />
                        </div>
                        <div className="uk-text-right">
                            <button className="uk-button uk-button-primary" type="submit" disabled={isAdding}>
                                {isAdding ? <div data-uk-spinner="ratio: 0.6"></div> : <FiPlusCircle />}
                                <span> Adicionar</span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};