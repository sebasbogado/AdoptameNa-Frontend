'use client'

import Button from '@/components/buttons/button';
import FAQDetail from '@/components/faq/faq-detail';
import FAQHead from '@/components/faq/faq-head';
import { TextFade } from '@/components/faq/TextFade';
import Image from 'next/image';
import Link from 'next/link';

import { handleContactClick } from '@/utils/email-handler'

import faqData from '@/lib/faq.json'

export default function Page() {

    const correo = "adoptamena@gmail.com"
    const asunto = "Consulta desde Adoptamena."
    const mensaje = "Hola, estoy interesado en Auspiciar su plataforma..."

    return (
        <div className="">
            <Image 
                src="/faq/faq.png" 
                alt=""
                width={1341}  
                height={435}
                className='relative rounded-[32px] top-[50px] left-[50px]'  
            />

            <div className="relative top-[30px] left-[340px]">
                <div className="relative flex items-center w-[756px]">
                    
                    <TextFade direction="down" staggerChildren={0.1} className="absolute items-center left-10 text-gray-500 text-xl">
                        <span>Search...</span>
                    </TextFade>

                    <input
                        className="w-[756px] h-[56px] bg-white rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]"
                        type="text"
                        placeholder=""
                        disabled
                    />
                    <button 
                        className="absolute right-0 top-0 bottom-0 px-[20px] bg-blue-500 text-gray-500 rounded-r-[6px]"
                        disabled>
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </div>
            </div>
            
            <div className='relative mt-[100px] mx-[100px]'>
                {faqData.map((category, idx) => (
                    <FAQHead key={idx} title={category.title}>
                        {category.items.map((item, index) => (
                            <FAQDetail key={index} question={item.question} answer={item.answer} />
                        ))}
                    </FAQHead>
                ))}
                
            </div><br />

        </div>
    );
}
