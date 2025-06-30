import React from 'react';
import './StatsCard.scss';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
    return (
        <div className="stats-card" style={{ borderLeftColor: color }}>
            <div className="stats-card-icon">{icon}</div>
            <div className="stats-card-info">
                <span className="stats-card-value">{value}</span>
                <span className="stats-card-label">{label}</span>
            </div>
        </div>
    );
};