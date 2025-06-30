import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';

import 'uikit/dist/css/uikit.min.css';

import '../styles/styles.scss';
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {Toaster} from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>

                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            success: { duration: 3000, style: { background: '#2ecc71', color: 'white' } },
                            error: { duration: 5000, style: { background: '#e74c3c', color: 'white' } },
                        }}
                    />

                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);