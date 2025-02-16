'use client'

import { useState } from 'react'

import useCustomEffect from '@/hooks/useCustomEffect'
import petsServices from '@/services/petsServices'
import Image from 'next/image'

export default function Page({params}) {

    const [pet, setPet] = useState(null)

    useCustomEffect(async()=>{
        return petsServices.getById(params.petId)
    }, {
        whereOptions: !isNaN(params.petId), 
        after: res=> {
            console.log("resultado", res) 
            setPet(res)
        }
        
    }, [params.petId])

    return (
        <div className='flex flex-col gap-5'>
            <h1>Pet {params.petId}</h1>
            <div className='flex flex-col gap-3'>
                <span>{pet?.name}</span>
                <span>{pet?.age}</span>
                <span>{pet?.type}</span>
                <span>{pet?.description}</span>
                <span>{pet?.contactNumber}</span>
                
            </div>
        </div>
    )
}