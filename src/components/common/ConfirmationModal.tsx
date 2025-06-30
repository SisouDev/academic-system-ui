import React, { useEffect, useRef } from 'react';
import UIkit from 'uikit';

interface ConfirmationModalProps {
    id: string;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isConfirming?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                        id,
                                                                        title,
                                                                        message,
                                                                        onConfirm,
                                                                        confirmLabel = 'Confirmar',
                                                                        cancelLabel = 'Cancelar',
                                                                    }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onConfirmClick = () => {
            onConfirm();
            if (modalRef.current) {
                UIkit.modal(modalRef.current).hide();
            }
        };

        const confirmButton = document.querySelector(`#${id}-confirm-button`);
        confirmButton?.addEventListener('click', onConfirmClick);

        return () => {
            confirmButton?.removeEventListener('click', onConfirmClick);
        };
    }, [id, onConfirm]);

    return (
        <div id={id} data-uk-modal ref={modalRef}>
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">{title}</h2>
                <p>{message}</p>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">
                        {cancelLabel}
                    </button>
                    <button id={`${id}-confirm-button`} className="uk-button uk-button-primary" type="button">
                        {confirmLabel}
                    </button>
                </p>
            </div>
        </div>
    );
};