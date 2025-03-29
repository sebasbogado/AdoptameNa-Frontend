'use client';

import FAQDetail from '@/components/faq/faq-detail';
import FAQHead from '@/components/faq/faq-head';
import { TextFade } from '@/components/faq/TextFade';
import Image from 'next/image';
import faqData from '@/lib/faq.json';
import { useEffect, useState } from 'react';

export default function Page() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number>(0); 

  useEffect(() => {
    const allQuestions = faqData
    .filter((section) => section.title.trim() !== "") 
    .flatMap((section) =>
      section.items
        .map((item) => item.question)
        .filter((question) => question.trim() !== "") 
    );
  
    setQuestions(allQuestions);
  
    const intervalId = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % allQuestions.length);
    }, 3000);
  
    return () => clearInterval(intervalId);
  }, []);

  
  const handleToggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index); 
  };

  return (
    <div className="w-full px-12">
      <Image
        src="/faq/faq.png"
        alt=""
        width={1341}
        height={435}
        layout="intrinsic"
        className="rounded-[32px] mx-auto w-full max-w-screen-lg mt-8"
      />

      <div className="relative -mt-5 px-4 md:px-16">
        <div className="relative flex justify-left pl-60 items-center">
          <TextFade direction="down" staggerChildren={0.1} className="absolute items-left text-gray-500 pl-5 text-xl ">
            <span>{questions.length > 0 ? questions[currentQuestionIndex] : 'Loading questions...'}</span>
          </TextFade>

          <input
            className="w-full md:w-[756px] md:h-[56px] bg-white rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]"
            type="text"
            placeholder=""
            disabled
            value="" 
          />
          <button className="bg-blue-500 text-gray-500 rounded-r-[6px] flex items-center justify-center -ml-10" disabled>
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

      <div className="mt-10 px-4 md:px-16">
        {faqData.map((category, idx) => (
          <FAQHead
            key={idx}
            title={category.title}
            isOpen={openIndex === idx} 
            onToggle={() => handleToggleOpen(idx)} 
          >
            {category.items.map((item, index) => (
              <FAQDetail key={index} question={item.question} answer={item.answer} />
            ))}
          </FAQHead>
        ))}
      </div>
      <br />
    </div>
  );
}
