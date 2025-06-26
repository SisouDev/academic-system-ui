import * as yup from 'yup';

export const userFormSchema = yup.object({
    name: yup.string().required('O nome é obrigatório.').min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: yup.string().email('Digite um email válido.').required('O email é obrigatório.'),
    role: yup.string().oneOf(['aluno', 'professor', 'funcionario']).required('O cargo é obrigatório.'),
}).required();

export type UserFormData = yup.InferType<typeof userFormSchema>;