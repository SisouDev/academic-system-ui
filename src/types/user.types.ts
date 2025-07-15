import type {InstitutionSummaryDto} from './institution.types';

interface BasePersonDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    createdAt: string;
    profilePictureUrl?: string;
    phone?: string;
    institution: InstitutionSummaryDto;
}

export interface StudentPersonDto extends BasePersonDto {
    personType: 'STUDENT';
    birthDate: string;
    courseName: string;
    generalAverage: number;
    totalAbsences: number;
}

export interface TeacherPersonDto extends BasePersonDto {
    personType: 'TEACHER';
    academicBackground: string;
    totalActiveSections: number;
}

export interface EmployeePersonDto extends BasePersonDto {
    personType: 'EMPLOYEE';
    jobPosition: string;
    hiringDate: string;
}

export interface InstitutionAdminPersonDto extends BasePersonDto {
    personType: 'STAFF';
}

export type PersonResponseDto =
    | StudentPersonDto
    | TeacherPersonDto
    | EmployeePersonDto
    | InstitutionAdminPersonDto;


export interface RoleDto {
    id: number;
    name: string;
}

export interface UserResponseDto {
    id: number;
    login: string;
    active: boolean;
    person: PersonResponseDto;
    roles: RoleDto[];
}

// DTO para a requisição de troca de senha.
export interface ChangePasswordRequestDto {
    oldPassword: string;
    newPassword: string;
}