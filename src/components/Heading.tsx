import type {JSX, ReactNode} from "react";

type HeadingProps = {
    children: ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    icon?: ReactNode;
    center?: boolean;
    className?: string;
};

export function Heading({
                            children,
                            icon,
                            level = 1,
                            className = "",
                            center = false,
                        }: HeadingProps) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const uikitClasses = [
        "uk-flex",
        "uk-flex-middle",
        "uk-text-bold",
        center ? "uk-flex-center" : "uk-flex-left",
        className,
    ].join(" ");

    return (
        <Tag className={uikitClasses}>
            {icon && <span className="uk-margin-small-right">{icon}</span>}
            {children}
        </Tag>
    );
}