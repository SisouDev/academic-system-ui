import { useState } from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { Table, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import {createAsset, getAssets} from '../../services/employee/itApi';
import type {AssetDetailsIt, AssetStatus, CreateAssetData} from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlusCircle } from 'lucide-react';
import {CreateAssetModal} from "../../features/it/CreateAssetModal.tsx";

const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'IN STOCK': return 'success';
        case 'IN USE': return 'primary';
        case 'IN MAINTENANCE': return 'warning';
        case 'DISPOSED': return 'secondary';
        default: return 'light';
    }
};

const AssetManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<AssetStatus | undefined>(undefined);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: assets, isLoading, isError } = useQuery<AssetDetailsIt[], Error>({
        queryKey: ['assets', statusFilter],
        queryFn: () => getAssets(statusFilter),
    });

    const createMutation = useMutation({
        mutationFn: createAsset,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['assets'] });
            setShowCreateModal(false);
        },
    });

    const handleSaveNewAsset = (data: CreateAssetData) => {
        createMutation.mutate(data);
    };

    const filters: { label: string; status?: AssetStatus }[] = [
        { label: 'Todos', status: undefined },
        { label: 'Em Estoque', status: 'IN_STOCK' },
        { label: 'Em Uso', status: 'IN_USE' },
        { label: 'Em Manutenção', status: 'IN_MAINTENANCE' },
        { label: 'Descartados', status: 'DISPOSED' },
    ];

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar os ativos.</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Ativos de TI</h1>
                <Button onClick={() => setShowCreateModal(true)}>
                    <PlusCircle size={18} className="me-2"/>
                    Novo Ativo
                </Button>
            </div>

            <ButtonGroup className="mb-3">
                {filters.map(filter => (
                    <Button
                        key={filter.label}
                        variant={statusFilter === filter.status ? 'primary' : 'outline-secondary'}
                        onClick={() => setStatusFilter(filter.status)}
                    >
                        {filter.label}
                    </Button>
                ))}
            </ButtonGroup>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th>Ativo</th>
                    <th>Patrimônio / Serial</th>
                    <th>Alocado para</th>
                    <th>Status</th>
                    <th>Data da Compra</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {assets && assets.length > 0 ? (
                    assets.map(asset => (
                        <tr key={asset.id}>
                            <td>{asset.name}</td>
                            <td>
                                <div><strong>Patrimônio:</strong> {asset.assetTag}</div>
                                <div className="small text-muted">Serial: {asset.serialNumber}</div>
                            </td>
                            <td>{asset.assignedTo?.fullName || <span className="text-muted">Em estoque</span>}</td>
                            <td>
                                <Badge bg={getStatusVariant(asset.status)}>{asset.status}</Badge>
                            </td>
                            <td>{format(new Date(asset.purchaseDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                            <td className="text-center">
                                <Button size="sm" variant="outline-secondary">Ações</Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={6} className="text-center text-muted p-4">Nenhum ativo encontrado.</td></tr>
                )}
                </tbody>
            </Table>

            <CreateAssetModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSave={handleSaveNewAsset}
                isSaving={createMutation.isPending}
            />
        </div>
    );
};

export default AssetManagementPage;