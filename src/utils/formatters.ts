export const formatRequestStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        IN_PROGRESS: "Em Andamento",
        COMPLETED: "Concluído",
        REJECTED: "Rejeitado",
        CANCELLED: "Cancelado"
    };
    return statusMap[status] || status;
};

export const formatRequestType = (type: string): string => {
    const typeMap: Record<string, string> = {
        MATERIAL_REQUEST: "Requisição de Material",
        MAINTENANCE_REQUEST: "Requisição de Manutenção",
        HR_REQUEST: "Requisição de RH"
    };
    return typeMap[type] || type;
};


export const formatUrgencyLevel = (urgency: string): string => {
    const urgencyMap: Record<string, string> = {
        LOW: "Baixa",
        MEDIUM: "Média",
        HIGH: "Alta",
        CRITICAL: "Crítica"
    };
    return urgencyMap[urgency] || urgency;
};

export const formatTaskStatus = (status?: string): string => {
    if (!status) return "Indefinido";
    const statusMap: Record<string, string> = {
        TODO: "A Fazer",
        IN_PROGRESS: "Em Andamento",
        DONE: "Concluída",
        CANCELLED: "Cancelada"
    };
    return statusMap[status] || status;
};