import { Card, Spinner } from 'react-bootstrap';
import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value?: number;
    icon: LucideIcon;
    isLoading: boolean;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const StatCard = ({ title, value, icon: Icon, isLoading }: StatCardProps) => {
    return (
        <motion.div variants={cardVariants}>
            <Card className="shadow-sm h-100">
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                            <div className="bg-primary-subtle text-primary p-3 rounded-3">
                                <Icon size={32} />
                            </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h5 className="text-muted fw-normal mb-1">{title}</h5>
                            {isLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <h3 className="mb-0 fw-bold">{value}</h3>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};