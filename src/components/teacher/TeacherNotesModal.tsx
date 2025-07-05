import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import UIkit from 'uikit';

type Note = { id: number; content: string; authorName: string; createdAt: string; };
type ApiResponse = { _embedded?: { teacherNoteDtoList: Note[] } };
type NewNoteFormData = { content:string; };
const noteValidationSchema = yup.object({
    content: yup.string().trim().required("O conteúdo é obrigatório.").min(3, "Mínimo de 3 caracteres."),
});

const fetchNotes = async (enrollmentId: number): Promise<Note[]> => {
    const res = await api.get<ApiResponse>(`/api/v1/teacher-notes?enrollmentId=${enrollmentId}`);
    return res.data._embedded?.teacherNoteDtoList || [];
};
const createNote = async (payload: { enrollmentId: number; content: string }) => {
    return api.post('/api/v1/teacher-notes', payload);
};
const deleteNote = async (noteId: number) => {
    await api.delete(`/api/v1/teacher-notes/${noteId}`);
};

interface TeacherNotesModalProps {
    enrollmentId: number;
    studentName: string;
    onClose: () => void;
}

export const TeacherNotesModal: React.FC<TeacherNotesModalProps> = ({ enrollmentId, studentName, onClose }) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewNoteFormData>({
        resolver: yupResolver(noteValidationSchema),
    });

    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['teacherNotes', enrollmentId],
        queryFn: () => fetchNotes(enrollmentId),
    });

    const addNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            toast.success('Anotação adicionada!');
            queryClient.invalidateQueries({ queryKey: ['teacherNotes', enrollmentId] });
            reset();
        },
        onError: () => toast.error('Erro ao adicionar anotação.'),
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            toast.success('Anotação removida.');
            queryClient.invalidateQueries({ queryKey: ['teacherNotes', enrollmentId] });
        },
        onError: () => toast.error('Erro ao remover anotação.'),
    });

    const onSubmit: SubmitHandler<NewNoteFormData> = (data) => {
        addNoteMutation.mutate({ enrollmentId, content: data.content });
    };

    const handleDeleteNote = (noteId: number) => {
        UIkit.modal.confirm('Tem certeza que deseja apagar esta anotação?').then(() => {
            deleteNoteMutation.mutate(noteId);
        }, () => { });
    };

    return (
        <div className="uk-flex-top uk-modal uk-open" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                <button className="uk-modal-close-default" type="button" onClick={onClose} data-uk-close />
                <h2 className="uk-modal-title">Anotações sobre {studentName}</h2>

                <div className="uk-margin" style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e5e5e5', padding: 10 }}>
                    {isLoading ? <div className="uk-text-center"><div data-uk-spinner /></div> : (
                        <ul className="uk-list uk-list-divider">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <li key={note.id} className="uk-flex uk-flex-middle uk-flex-between">
                                        <div>
                                            <p className="uk-margin-remove">{note.content}</p>
                                            <p className="uk-text-meta uk-margin-remove">Por {note.authorName} em {note.createdAt}</p>
                                        </div>
                                        <button
                                            className="uk-icon-button uk-button-danger"
                                            title="Apagar anotação"
                                            onClick={() => handleDeleteNote(note.id)}
                                            disabled={deleteNoteMutation.isPending}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </li>
                                ))
                            ) : <p className="uk-text-center uk-text-muted">Nenhuma anotação.</p>}
                        </ul>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Nova Anotação</legend>
                        <textarea
                            rows={3}
                            placeholder="Escreva sua observação..."
                            className={`uk-textarea ${errors.content ? 'uk-form-danger' : ''}`}
                            {...register('content')}
                        />
                        {errors.content && <p className="uk-text-danger uk-margin-small-top">{errors.content.message}</p>}
                        <div className="uk-text-right uk-margin-small-top">
                            <button className="uk-button uk-button-primary" type="submit" disabled={addNoteMutation.isPending}>
                                {addNoteMutation.isPending ? <div data-uk-spinner="ratio:0.6" /> : <FiPlusCircle />} Adicionar
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};