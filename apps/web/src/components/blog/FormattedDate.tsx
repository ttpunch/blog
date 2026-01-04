'use client';

import React from 'react';

export const FormattedDate = ({ date }: { date: Date }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <span className="opacity-0">Loading...</span>;

    return (
        <>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
    );
};
