const toEnumKey = (text: string): string => {
    return text.toUpperCase().replace(/\s+/g, '_');
};

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

export const formatTicketStatus = (status?: string): string => {
    if (!status) return "Indefinido";
    const key = toEnumKey(status);
    const statusMap: Record<string, string> = {
        OPEN: "Aberto",
        IN_PROGRESS: "Em Andamento",
        WAITING_FOR_USER: "Aguardando Usuário",
        RESOLVED: "Resolvido",
        CLOSED: "Fechado"
    };
    return statusMap[key] || status;
};

export const formatTicketPriority = (priority?: string): string => {
    if (!priority) return "Indefinida";
    const key = toEnumKey(priority);
    const priorityMap: Record<string, string> = {
        LOW: "Baixa",
        MEDIUM: "Média",
        HIGH: "Alta",
        CRITICAL: "Crítica"
    };
    return priorityMap[key] || priority;
};

export const formatTicketCategory = (category?: string): string => {
    if (!category) return "Não categorizado";
    const key = toEnumKey(category);
    const categoryMap: Record<string, string> = {
        SYSTEM_BUG: "Erro no Sistema",
        LOGIN_ISSUE: "Problema de Login",
        FEATURE_REQUEST: "Sugestão de Funcionalidade",
        GENERAL_QUESTION: "Dúvida Geral",
        ACCOUNT_PROBLEM: "Problema na Conta",
        OTHER: "Outro"
    };
    return categoryMap[key] || category;
};

export const formatMeetingStatus = (status?: string): string => {
    if (!status) return "Pendente";
    const key = toEnumKey(status);
    const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        ACCEPTED: "Aceito",
        DECLINED: "Recusado",
        TENTATIVE: "Talvez"
    };
    return statusMap[key] || status;
};


export const formatEventType = (type?: string): string => {
    if (!type) return "Evento";
    const key = toEnumKey(type);
    const eventMap: Record<string, string> = {
        MEETING: "Reunião",
        DEADLINE: "Prazo Final",
        TRAINING: "Treinamento",
        HOLIDAY: "Feriado",
        SCHOOL_EVENT: "Evento Escolar",
        CUSTOM: "Personalizado",
        WORKSHOP: "Oficina"
    };
    return eventMap[key] || type;
};