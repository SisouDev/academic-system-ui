import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../services/api.ts';
import { toast } from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

type Department = { id: number; name: string; acronym: string; };
type FormInputs = Omit<Department, 'id'>;

const schema = yup.object({
    name: yup.string().required("O nome do departamento é obrigatório."),
    acronym: yup.string().required("A sigla é obrigatória.").max(10, "A sigla deve ter no máximo 10 caracteres."),
});

interface DepartmentFormModalProps {
    departmentToEdit: Department | null;
    institutionId: number;
    onClose: () => void;
    onSave: () => void;
}


const saveDepartment = ({ id, data, institutionId }: { id?: number, data: FormInputs, institutionId: number }) => {
    const payload = { ...data, institutionId };
    if (id) {
        return api.put(`/api/v1/departments/${id}`, payload);
    }
    return api.post('/api/v1/departments', payload);
};

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({ departmentToEdit, institutionId, onClose, onSave }) => {
    const queryClient = useQueryClient();
    const isEditing = !!departmentToEdit;

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: departmentToEdit?.name || '',
            acronym: departmentToEdit?.acronym || ''
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: saveDepartment,
        onSuccess: () => {
            toast.success(`Departamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            onSave();
        },
        onError: () => toast.error("Ocorreu um erro ao salvar o departamento."),
    });

    const onSubmit: SubmitHandler<FormInputs> = (formData) => {
        mutate({ id: departmentToEdit?.id, data: formData, institutionId });
    };

    return (
        <div className="uk-flex-top uk-modal uk-open" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                <button className="uk-modal-close-default" type="button" onClick={onClose} data-uk-close />
                <h2 className="uk-modal-title">{isEditing ? 'Editar Departamento' : 'Novo Departamento'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="dept-name">Nome</label>
                        <input id="dept-name" className={`uk-input ${errors.name ? 'uk-form-danger' : ''}`} {...register('name')} />
                        {errors.name && <p className="uk-text-danger uk-margin-small-top">{errors.name.message}</p>}
                    </div>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="dept-acronym">Sigla</label>
                        <input id="dept-acronym" className={`uk-input ${errors.acronym ? 'uk-form-danger' : ''}`} {...register('acronym')} />
                        {errors.acronym && <p className="uk-text-danger uk-margin-small-top">{errors.acronym.message}</p>}
                    </div>
                    <div className="uk-text-right uk-margin-top">
                        <button className="uk-button uk-button-default" type="button" onClick={onClose}>Cancelar</button>
                        <button className="uk-button uk-button-primary uk-margin-small-left" type="submit" disabled={isPending}>
                            <FiSave /> {isPending ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};