'use client'

import Button from '@/components/buttons/button';
import FAQDetail from '@/components/faq/faq-detail';
import FAQHead from '@/components/faq/faq-head';
import { TextFade } from '@/components/faq/TextFade';
import Image from 'next/image';
import Link from 'next/link';

import faqData from '@/lib/faq.json'
import { useEffect, useState } from 'react';

export default function Page() {

  
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const filteredData = faqData.filter(section => section.title.trim() !== "");
        
        const allQuestions = filteredData.flatMap(section => section.items.map(item => item.question));
        setQuestions(allQuestions);
    
        const intervalId = setInterval(() => {
          setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % allQuestions.length); 
        }, 3000);
    
        return () => clearInterval(intervalId);
      }, []);

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
                    <span>{questions.length > 0 ? questions[currentQuestionIndex] : 'Loading questions...'}</span>
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
