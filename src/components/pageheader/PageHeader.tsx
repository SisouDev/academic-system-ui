import * as React from 'react';
import { Heading } from '../Heading';
import './PageHeader.scss';

type PageHeaderProps = {
    title: string;
    children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
    return (
        <div className="page-header">
            <Heading level={2}>{title}</Heading>
            <div className="page-header-actions">
                {children}
            </div>
        </div>
    );
}