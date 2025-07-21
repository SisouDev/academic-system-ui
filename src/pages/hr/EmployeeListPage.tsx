import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Alert, Form, InputGroup, Image } from 'react-bootstrap';
import { getEmployees } from '../../services/employee/employeeApi';
import { Link } from 'react-router-dom';
import { Eye, UserPlus, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import type { EmployeeList } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import defaultAvatar from '../../assets/default-avatar.png';

const EmployeeListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data: employees, isLoading, isError, error } = useQuery<EmployeeList[], Error>({
        queryKey: ['employees', debouncedSearchTerm],
        queryFn: () => getEmployees(debouncedSearchTerm),
        placeholderData: (previousData) => previousData,
    });

    if (isError) return <Alert variant="danger">Erro ao carregar funcionários: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Funcionários</h1>
                <Link to="/hr/employees/new" className="btn btn-primary d-inline-flex align-items-center">
                    <UserPlus size={18} className="me-2" />
                    Novo Funcionário
                </Link>
            </div>

            <InputGroup className="mb-3">
                <InputGroup.Text><Search size={16}/></InputGroup.Text>
                <Form.Control
                    placeholder="Buscar por nome, e-mail ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th style={{width: '5%'}} className="text-center">#</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th className="text-end">Salário Base</th>
                    <th>Data de Contratação</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {isLoading && <tr><td colSpan={5} className="text-center p-5"><Spinner /></td></tr>}
                {employees && employees.length > 0 ? (
                    employees.map(employee => (
                        <tr key={employee.id}>
                            <td className="text-center">
                                <Image
                                    src={employee.profilePictureUrl || defaultAvatar}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    alt={`Foto de ${employee.fullName}`}
                                />
                            </td>
                            <td>
                                <div className="fw-bold">{employee.fullName}</div>
                                <div className="small text-muted">{employee.email}</div>
                            </td>
                            <td>{employee.jobPosition}</td>
                            <td className="text-end">
                                {employee.baseSalary
                                    ? employee.baseSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : <span className="text-muted">Não definido</span>
                                }
                            </td>
                            <td>{format(new Date(employee.hiringDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                            <td className="text-center">
                                <Link to={`/users/${employee.id}`} className="btn btn-outline-primary btn-sm">
                                    <Eye size={16} />
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    !isLoading && <tr><td colSpan={5} className="text-center text-muted p-4">Nenhum funcionário encontrado.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default EmployeeListPage;