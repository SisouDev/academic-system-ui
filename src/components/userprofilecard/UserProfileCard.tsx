import { Avatar } from '../avatar';
import { Heading } from '../Heading';
import { Mail, Phone } from 'lucide-react';
import './UserProfileCard.scss';

export type UserProfile = {
    name: string;
    role: 'Aluno' | 'Professor' | 'Funcionário';
    email: string;
    phone?: string;
    avatarSrc?: string | null;
};

type UserProfileCardProps = {
    user: UserProfile;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
    return (
        <div className="user-profile-card">
            <div className="user-profile-card__header">
                <Avatar src={user.avatarSrc} name={user.name} size="large" />
                <div className="user-profile-card__identity">
                    <Heading level={3}>{user.name}</Heading>
                    <span className="user-profile-card__role">{user.role}</span>
                </div>
            </div>
            <div className="user-profile-card__body">
                <div className="user-profile-card__contact-item">
                    <Mail size={16} />
                    <span>{user.email}</span>
                </div>
                {user.phone && (
                    <div className="user-profile-card__contact-item">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
}