import { PageHeader } from '../../components/pageheader';
import { DataTable, type ColumnDef } from '../../components/datatable';
import { Button } from '../../components/button';

type Aluno = {
    id: number;
    nome: string;
    email: string;
    status: string;
};

const mockAlunos: Aluno[] =  [
    { id: 1, nome: 'Ana Carolina', email: 'ana.c@escola.edu', status: 'Ativo' },
    { id: 2, nome: 'Bruno Silva', email: 'bruno.s@escola.edu', status: 'Inativo' },
    { id: 3, nome: 'Carlos de Andrade', email: 'carlos.a@escola.edu', status: 'Ativo' },
    { id: 4, nome: 'Daniela Ferreira', email: 'daniela.f@escola.edu', status: 'Transferido' },
];


const colunas: ColumnDef<Aluno>[] = [
    { key: 'nome', label: 'Nome do Aluno' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
];

export function StudentListPage() {

    const handleCreate = () => {
        alert('Simulando: Navegar para a página de criação de aluno...');
    };

    const handleEdit = (aluno: Aluno) => {
        alert(`Simulando: Editar o aluno ${aluno.nome}`);
    };

    const handleDelete = (aluno: Aluno) => {
        if (confirm(`Tem certeza que deseja excluir ${aluno.nome}?`)) {
            alert(`Simulando: Excluir o aluno ${aluno.nome}`);
        }
    };

    return (
        <div>
            <PageHeader title="Gerenciamento de Alunos">
                <Button variant="primary" onClick={handleCreate}>
                    + Adicionar Aluno
                </Button>
            </PageHeader>

            <DataTable
                columns={colunas}
                data={mockAlunos}
                renderActions={(aluno: Aluno) => (
                    <>
                        <Button size="small" variant="default" onClick={() => handleEdit(aluno)}>Editar</Button>
                        <Button size="small" variant="danger" onClick={() => handleDelete(aluno)}>Excluir</Button>
                    </>
                )}
            />
        </div>
    );
}