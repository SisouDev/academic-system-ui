export type Notification = {
    id: number;
    message: string;
    link: string;
    createdAt: string;
    type: string;
    status: 'READ' | 'UNREAD';
};
