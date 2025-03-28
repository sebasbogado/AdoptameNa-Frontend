import React, { ReactNode } from 'react';

interface FAQDetailProps {
    question?: string;
    answer: ReactNode;
  }

  const FAQDetail: React.FC<FAQDetailProps> = ({ question, answer }) => {
    return (
        <div className="mt-4">
          {question && <p><b className='text-lg'>{question}</b><br /></p>}
            {answer}
          <br/>
        </div>
      );
};

export default FAQDetail;