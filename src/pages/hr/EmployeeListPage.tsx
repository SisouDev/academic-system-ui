import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Alert, Form, InputGroup, Image } from 'react-bootstrap';
import { getEmployees } from '../../services/employee/employeeApi';
import { Link } from 'react-router-dom';
import { Eye, UserPlus, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import type {StaffList} from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


import defaultAvatar from '../../assets/default-avatar.png';
import {formatPositionOrDegree} from "../../utils/hr/components/formatters.ts";

const EmployeeListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data: staff, isLoading, isError, error } = useQuery<StaffList[], Error>({
        queryKey: ['staff', debouncedSearchTerm],
        queryFn: () => getEmployees(debouncedSearchTerm),
        placeholderData: (previousData) => previousData,
    });

    if (isError) return <Alert variant="danger">Erro ao carregar funcionários: {(error as Error).message}</Alert>;


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Equipe</h1>
                <Link to="/hr/employees/new" className="btn btn-primary d-inline-flex align-items-center">
                    <UserPlus size={18} className="me-2" />
                    Novo Membro
                </Link>
            </div>

            <InputGroup className="mb-3">
                <InputGroup.Text><Search size={16}/></InputGroup.Text>
                <Form.Control
                    placeholder="Buscar por nome, cargo ou formação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th style={{width: '5%'}} className="text-center">#</th>
                    <th>Nome</th>
                    <th>Cargo / Formação</th>
                    <th className="text-end">Salário Base</th>
                    <th>Data de Contratação</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {isLoading && <tr><td colSpan={6} className="text-center p-5"><Spinner /></td></tr>}
                {staff && staff.length > 0 ? (
                    staff.map(person => (
                        <tr key={person.id}>
                            <td className="text-center">
                                <Image
                                    src={person.profilePictureUrl || defaultAvatar}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    alt={`Foto de ${person.fullName}`}
                                />
                            </td>
                            <td>
                                <div className="fw-bold">{person.fullName}</div>
                                <div className="small text-muted">{person.email}</div>
                            </td>
                            <td>
                                {formatPositionOrDegree(person.positionOrDegree)}
                            </td>
                            <td className="text-end">
                                {person.baseSalary
                                    ? person.baseSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : <span className="text-muted">Não definido</span>
                                }
                            </td>
                            <td>
                                {person.hiringDate
                                    ? format(new Date(person.hiringDate), 'dd/MM/yyyy', { locale: ptBR })
                                    : <span className="text-muted">N/A</span>
                                }
                            </td>
                            <td className="text-center">
                                <Link to={`/users/${person.id}`} className="btn btn-outline-primary btn-sm">
                                    <Eye size={16} />
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    !isLoading && <tr><td colSpan={6} className="text-center text-muted p-4">Nenhum membro da equipe encontrado.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default EmployeeListPage;