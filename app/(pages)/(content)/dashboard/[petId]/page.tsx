'use client'

import { useState } from 'react'
import useCustomEffect from '@/hooks/useCustomEffect'
import petsServices from '@/services/petsServices'
import Image from 'next/image'

interface Pet {
  name: string
  age: number
  type: string
  description: string
  contactNumber: string
}

interface PageProps {
  params: { petId: string }
}

export default function Page({ params }: PageProps) {
  const [pet, setPet] = useState<Pet | null>(null)

  useCustomEffect(async () => {
    return petsServices.getById(params.petId)
  }, {
    whereOptions: !isNaN(Number(params.petId)), // Convertir a número antes de validar
    after: (res: Pet) => {
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
