import type {ReactNode} from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
}

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <motion.div
                className="card shadow"
                style={{ width: '24rem' }}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="card-body p-5">
                    <h2 className="card-title text-center mb-4">{title}</h2>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};