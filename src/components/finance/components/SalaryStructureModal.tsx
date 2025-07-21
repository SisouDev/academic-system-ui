import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { SalaryStructureRequest } from '../../../types';

interface SalaryStructureModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: SalaryStructureRequest) => void;
    isSaving: boolean;
    initialData?: SalaryStructureRequest;
}

export const SalaryStructureModal = ({ show, onHide, onSave, isSaving, initialData }: SalaryStructureModalProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<SalaryStructureRequest>({
        defaultValues: initialData || { jobPosition: '', level: '', baseSalary: 0 }
    });

    const onSubmit: SubmitHandler<SalaryStructureRequest> = (data) => {
        onSave({ ...initialData, ...data });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>{initialData ? 'Editar' : 'Criar'} Estrutura Salarial</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Cargo</Form.Label>
                        <Form.Control as="select" {...register('jobPosition', { required: true })} isInvalid={!!errors.jobPosition}>
                            <option value="TEACHER">Professor</option>
                            <option value="LIBRARIAN">Bibliotecário</option>
                            <option value="TECHNICIAN">Técnico de TI</option>
                            <option value="HR_ANALYST">Analista de RH</option>
                            <option value="COORDINATOR">Coordenador</option>
                            <option value="DIRECTOR">Diretor</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nível</Form.Label>
                        <Form.Control as="select" {...register('level', { required: true })} isInvalid={!!errors.level}>
                            <option value="JUNIOR">Júnior</option>
                            <option value="MID_LEVEL">Pleno</option>
                            <option value="SENIOR">Sênior</option>
                            <option value="LEAD">Líder</option>
                            <option value="PRINCIPAL">Principal</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Salário Base (R$)</Form.Label>
                        <Form.Control type="number" step="0.01" {...register('baseSalary', { required: true, valueAsNumber: true })} isInvalid={!!errors.baseSalary} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? <Spinner size="sm" /> : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};