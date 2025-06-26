import * as React from 'react';

type AvatarProps = {
    name: string;
    src?: string | null;
    size?: 'small' | 'medium' | 'large';
} & React.HTMLAttributes<HTMLDivElement>;

function getInitials(name: string): string {
    if (!name) return '?';

    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return '?';

    const firstInitial = words[0][0];
    const lastInitial = words.length > 1 ? words[words.length - 1][0] : '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function Avatar({
                           name,
                           src,
                           size = 'medium',
                           className = '',
                           ...props
                       }: AvatarProps) {
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageError(false);
    }, [src]);

    const showFallback = !src || imageError;

    const avatarClasses = [
        'app-avatar',
        `app-avatar--${size}`,
        className,
    ].join(' ');

    return (
        <div className={avatarClasses} {...props}>
            {showFallback ? (
                <span className="app-avatar-initials">{getInitials(name)}</span>
            ) : (
                <img
                    src={src}
                    alt={name}
                    className="app-avatar-image"
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
}