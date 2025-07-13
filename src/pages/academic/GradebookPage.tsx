import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Button, Modal } from 'react-bootstrap';
import api from '../../services/auth/api';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

import type { GradebookData } from '../../types';
import { GradebookTable } from '../../features/gradebook/components/GradebookTable';
import { CreateAssessmentDefinitionForm } from '../../features/gradebook/components/CreateAssessmentDefinitionForm';

const getGradebookData = async (sectionId?: string): Promise<GradebookData> => {
    if (!sectionId) throw new Error("ID da turma não fornecido.");
    const { data } = await api.get(`/api/v1/gradebooks?courseSectionId=${sectionId}`);
    return data;
};

export default function GradebookPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: gradebook, isLoading, isError, error } = useQuery({
        queryKey: ['gradebook', sectionId],
        queryFn: () => getGradebookData(sectionId),
        enabled: !!sectionId,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar diário de classe: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Diário de Classe</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    <PlusCircle size={18} className="me-2" />
                    Criar Nova Avaliação
                </Button>
            </div>

            {gradebook && <GradebookTable gradebook={gradebook} sectionId={sectionId} />}

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Nova Avaliação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateAssessmentDefinitionForm sectionId={Number(sectionId)} onDone={() => setShowCreateModal(false)} />
                </Modal.Body>
            </Modal>
        </div>
    );
}