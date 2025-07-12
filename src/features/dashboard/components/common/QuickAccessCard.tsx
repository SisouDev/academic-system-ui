import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ElementType } from 'react';

type QuickAccessCardProps = {
    title: string;
    value: string | number;
    icon: ElementType;
    to: string;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'secondary';
};

export const QuickAccessCard = ({ title, value, icon: Icon, to, variant = "primary" }: QuickAccessCardProps) => (
    <motion.div whileHover={{ y: -5, scale: 1.03 }} className="h-100">
        <Card as={Link} to={to} className="text-decoration-none h-100 shadow-sm text-center">
            <Card.Body className="d-flex flex-column justify-content-center p-3">
                <div className={`text-${variant} mb-2`}>
                    <Icon size={32} />
                </div>
                <Card.Title as="h6" style={{ fontFamily: 'Raleway, sans-serif' }} className="fw-bold">{title}</Card.Title>
                <p className="fs-5 text-body-emphasis mb-0">
                    {value}
                </p>
            </Card.Body>
        </Card>
    </motion.div>
);