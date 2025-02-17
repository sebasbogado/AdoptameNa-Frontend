'use client'

import { useAppContext } from '@/contexts/appContext'
import Banners from '@components/banners'

export default function Page() {
    const {name}= useAppContext()
    return (
        <div className='flex flex-col gap-5'>
            <h1>Missing {name}</h1>
            <Banners/>
        </div>
    )
}