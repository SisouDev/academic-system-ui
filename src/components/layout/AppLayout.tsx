import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidenav } from './Sidenav';
import { Topnav } from './Topnav';
import { Footer } from '../common/Footer';

export const AppLayout = () => {
    const location = useLocation();

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

            <Sidenav />

            <div className="flex-grow-1 d-flex flex-column vh-100 overflow-auto">

                <Topnav />

                <main className="flex-grow-1 p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                <Footer />
            </div>
        </div>
    );
};