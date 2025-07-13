import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ElementType } from 'react';

type ActionCardProps = {
    title: string;
    description: string;
    icon: ElementType;
    to: string;
    badgeContent?: string | number;
    variant?: string;
};

export const ActionCard = ({ title, description, icon: Icon, to, badgeContent, variant = "primary" }: ActionCardProps) => (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="h-100">
        <Card as={Link} to={to} className="text-decoration-none h-100 shadow-sm text-body">
            <Card.Body>
                <div className="d-flex align-items-start">
                    <div className={`text-${variant} bg-${variant}-subtle p-3 rounded-3 me-3`}>
                        <Icon size={24} />
                    </div>
                    <div className="flex-grow-1">
                        <Card.Title as="h5" style={{ fontFamily: 'Raleway, sans-serif' }}>{title}</Card.Title>
                        <Card.Text className="text-muted small">{description}</Card.Text>
                    </div>
                    {badgeContent !== undefined && (
                        <Badge pill bg="danger">
                            {badgeContent}
                        </Badge>
                    )}
                </div>
            </Card.Body>
        </Card>
    </motion.div>
);