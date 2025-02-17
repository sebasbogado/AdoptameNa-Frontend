import { useEffect, useState } from 'react';

interface Options {
    whereOptions?: boolean;
    after: (res: any) => void;
    msDelay?: number;
}

const useCustomEffect = (
    asyncFunc: () => Promise<any>,
    { whereOptions = true, after, msDelay = 100 }: Options,
    dependencies: any[]
) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchToggle, setFetchToggle] = useState<boolean>(false);

    const handleFetchToggle = () => {
        setFetchToggle(prev => !prev);
    };

    useEffect(() => {
        let isCanceled = false;
        let proceed = whereOptions;

        if (!proceed) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const timeout = setTimeout(() => {
            if (isCanceled) return;

            asyncFunc()
                .then(res => {
                    if (!isCanceled) after(res);
                })
                .finally(() => {
                    if (!isCanceled) setLoading(false);
                });
        }, msDelay);

        return () => {
            isCanceled = true;
            clearTimeout(timeout);
        };
    }, [...dependencies, fetchToggle]);

    return { loading, fetch: handleFetchToggle };
};

export default useCustomEffect;
