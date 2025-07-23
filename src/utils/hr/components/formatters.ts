const jobPositionMap: { [key: string]: string } = {
    'secretary': 'Secretária(o)',
    'coordinator': 'Coordenador(a)',
    'director': 'Diretor(a)',
    'technician': 'Técnico de TI',
    'librarian': 'Bibliotecário(a)',
    'assistant': 'Assistente',
    'hr analyst': 'Analista de RH',
    'manager': 'Gerente',
    'finance analyst': 'Analista Financeiro',
    'teacher': 'Professor(a)'
};

const academicDegreeMap: { [key: string]: string } = {
    'bachelor': 'Bacharelado',
    'licentiate': 'Licenciatura',
    'specialization': 'Especialização',
    'master': 'Mestrado',
    'phd': 'Doutorado',
    'postdoctorate': 'Pós-Doutorado',
    'technical': 'Técnico'
};

export const formatPositionOrDegree = (positionOrDegree?: string): string => {
    if (!positionOrDegree) return 'Não definido';

    const key = positionOrDegree.toLowerCase();

    return jobPositionMap[key] || academicDegreeMap[key] || positionOrDegree;
};