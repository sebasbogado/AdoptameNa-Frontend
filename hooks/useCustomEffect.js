import { useEffect, useState } from 'react'

const useCustomEffect = (asyncFunc, { whereOptions, after, msDelay = 100 }, dependencies) => {

    const [loading, setLoading] = useState(true)
    const [fetchToogle, setFetchToogle] = useState(false)

    const handleFetchToogle = () => {
        setFetchToogle(!fetchToogle)
    }

    useEffect(() => {

        let isCanceled = false
        let proceed = whereOptions ?? true

        if(!proceed) {
            setLoading(false)
            return
        }

        setLoading(true)

        setTimeout(() => {
            if(isCanceled) return
            asyncFunc()
                .then(res => { if(!isCanceled) after(res) })
                .finally(() => { if(!isCanceled) setLoading(false) })
        }, msDelay)

        return () => isCanceled = true

    }, [...dependencies, fetchToogle])

    return { loading, fetch: handleFetchToogle }
}

export default useCustomEffect