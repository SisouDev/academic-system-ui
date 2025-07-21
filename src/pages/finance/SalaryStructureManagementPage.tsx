import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getSalaryStructures, createSalaryStructure, updateSalaryStructure, deleteSalaryStructure } from '../../services/employee/financeApi';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { SalaryStructure, SalaryStructureRequest } from '../../types';
import { SalaryStructureModal } from '../../components/finance/components/SalaryStructureModal';

const SalaryStructureManagementPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingStructure, setEditingStructure] = useState<SalaryStructure | undefined>(undefined);
    const queryClient = useQueryClient();

    const { data: structures, isLoading, isError } = useQuery<SalaryStructure[], Error>({
        queryKey: ['salaryStructures'],
        queryFn: getSalaryStructures,
    });

    const mutation = useMutation({
        mutationFn: (data: SalaryStructureRequest) => data.id ? updateSalaryStructure(data) : createSalaryStructure(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['salaryStructures'] });
            setShowModal(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSalaryStructure,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['salaryStructures'] });
        },
    });

    const handleSave = (data: SalaryStructureRequest) => {
        mutation.mutate(data);
    };

    const handleEdit = (structure: SalaryStructure) => {
        setEditingStructure(structure);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingStructure(undefined);
        setShowModal(true);
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar estruturas salariais.</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Estruturas Salariais</h1>
                <Button onClick={handleAddNew}><PlusCircle size={18} className="me-2"/>Adicionar Nova</Button>
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th>Cargo</th>
                    <th>Nível</th>
                    <th className="text-end">Salário Base</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {structures?.map(structure => (
                    <tr key={structure.id}>
                        <td>{structure.jobPosition}</td>
                        <td>{structure.level}</td>
                        <td className="text-end">{structure.baseSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="text-center">
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(structure)} className="me-2"><Edit size={16}/></Button>
                            <Button variant="outline-danger" size="sm" onClick={() => deleteMutation.mutate(structure.id)}><Trash2 size={16}/></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {showModal && (
                <SalaryStructureModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    onSave={handleSave}
                    isSaving={mutation.isPending}
                    initialData={editingStructure}
                />
            )}
        </div>
    );
};

export default SalaryStructureManagementPage;