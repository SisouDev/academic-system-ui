import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header.tsx';
import { Footer } from '../components/Footer.tsx';

export function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Header />

            <main className="uk-flex-auto uk-section">
                <div className="app-main-container" >
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}