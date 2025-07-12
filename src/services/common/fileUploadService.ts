import api from '../auth/api';

export const uploadFile = async (file: File | Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/api/v1/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data.url;
};