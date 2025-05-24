'use client';

import FAQDetail from '@/components/faq/faq-detail';
import FAQHead from '@/components/faq/faq-head';
import { TextFade } from '@/components/faq/TextFade';
import faqData from '@/lib/faq.json';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import ImageComponent from '@/components/image-component';
import SkeletonStaticPage from '@/components/skeleton-static-page';

export default function Page() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number>(0); 
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [filteredData, setFilteredData] = useState<typeof faqData>(faqData); 
  const [showTextFade, setShowTextFade] = useState(true); 

  const inputRef = useRef<HTMLInputElement>(null);

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

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

    // Simulate a small loading time to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
  
    return () => {
      clearInterval(intervalId);
      clearTimeout(timer);
    };
  }, []);

  
  const handleToggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index); 
  };

 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value; 
    setSearchQuery(query); 
  
    
    if (query.trim() !== '') {

      const normalizedQuery = removeAccents(query.toLowerCase());
      
      const filtered = faqData.map((category) => {
        
        const filteredItems = category.items.filter(
          (item) =>
            removeAccents(item.question.toLowerCase()).includes(normalizedQuery) || removeAccents(item.answer.toLowerCase()).includes(normalizedQuery)
        );
    
        
        if (removeAccents(category.title.toLowerCase()).includes(normalizedQuery)) {
          return { ...category, items: category.items }; 
        } else {
          return { ...category, items: filteredItems }; 
        }
      });

      const validCategories = filtered.filter((category) => category.items.length > 0 || 
                                                            removeAccents(category.title.toLowerCase()).includes(normalizedQuery));
      setFilteredData(validCategories);

    } else {
     
      setFilteredData(faqData);
    }
  };

  
  const handleInputFocus = () => {
    setShowTextFade(false); 
  };

  const handleInputBlur = () => {
    if (searchQuery === '') {
      setShowTextFade(true);
    }
  };

  const handleTextFadeClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (isLoading) {
    return <SkeletonStaticPage />;
  }

  return (
    <div className="w-full px-12">
      <ImageComponent src="/faq/faq.png" />

      <div className="relative -mt-5 px-4 md:px-16">
        <div className="relative flex justify-left pl-60 items-center">
          
        {showTextFade && (
          <TextFade direction="down" staggerChildren={0.1} className="absolute items-left text-gray-500 pl-5 text-xl " onClick={handleTextFadeClick}>
            <span>{questions.length > 0 ? questions[currentQuestionIndex] : 'Loading questions...'}</span>
          </TextFade>
        )}
          <input
            ref={inputRef}
            className="w-full md:w-[756px] md:h-[56px] bg-white rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]"
            type="text"
            placeholder=""
            value={searchQuery} 
            onChange={handleSearchChange}
            onFocus={handleInputFocus} 
            onBlur={handleInputBlur} 
          />
          <button className="bg-blue-500 text-gray-500 rounded-r-[6px] flex items-center justify-center -ml-10" disabled>
            <Search/>
          </button>
        </div>
      </div>

      <div className="mt-10 px-4 md:px-16">
        {filteredData.length > 0 ? (
          filteredData.map((category, idx) => (
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
          ))
        ) : (
          <p className="text-center text-gray-500">No se encontraron resultados para "{searchQuery}".</p>
        )}
      </div>
      <br />
    </div>
  );
}
