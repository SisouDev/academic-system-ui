import { Card, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import CountUp from 'react-countup';

interface KPIProps {
    title: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
    icon: LucideIcon;
    color: string;
    delay?: number;
}

export const KPI = ({ title, value, prefix = '', suffix = '', icon: Icon, color, delay = 0 }: KPIProps) => {
    const isNumeric = typeof value === 'number';

    return (
        <Col md={6} lg={3}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
            >
                <Card className="shadow-sm border-start border-4" style={{ borderColor: color }}>
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className="text-muted mb-1">{title}</p>
                                <h4 className="mb-0">
                                    {isNumeric ? (
                                        <CountUp
                                            start={0}
                                            end={value}
                                            duration={2}
                                            separator="."
                                            decimal=","
                                            prefix={prefix}
                                            suffix={suffix}
                                        />
                                    ) : (
                                        value
                                    )}
                                </h4>
                            </div>
                            <div className="flex-shrink-0">
                                <Icon size={32} className="text-muted" style={{ color }} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </motion.div>
        </Col>
    );
};