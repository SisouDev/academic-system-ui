import React, { useEffect, type ReactNode, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthContext } from '../auth/AuthContext.tsx';
import { useQueryClient } from '@tanstack/react-query';

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const queryClient = useQueryClient();

    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            console.log('Tentando conectar ao WebSocket, pois o usuário está autenticado...');

            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Usuário autenticado mas token não encontrado no localStorage.");
                return;
            }

            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                debug: (str) => {
                    console.log(new Date(), str);
                },
                onConnect: () => {
                    console.log('✅ Conectado ao Servidor WebSocket!');

                    client.subscribe('/user/queue/notifications', (message) => {
                        try {
                            const newNotification = JSON.parse(message.body);
                            console.log('📬 Nova notificação recebida em tempo real:', newNotification);

                            queryClient.invalidateQueries({ queryKey: ['notifications'] });
                        } catch (e) {
                            console.error("Erro ao processar mensagem do WebSocket:", e);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('Erro no Broker STOMP:', frame.headers['message'], frame.body);
                },
            });

            client.activate();
            stompClientRef.current = client;

        } else {
            if (stompClientRef.current?.active) {
                console.log('Desconectando do WebSocket, pois o usuário fez logout.');
                stompClientRef.current.deactivate();
            }
        }

        return () => {
            if (stompClientRef.current?.active) {
                console.log('Limpando e desconectando do WebSocket.');
                stompClientRef.current.deactivate();
            }
        };
    }, [isAuthenticated, queryClient]);

    return <>{children}</>;
};