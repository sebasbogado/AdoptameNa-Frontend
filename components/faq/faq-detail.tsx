import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

import { handleContactClick } from '@/utils/email-handler';

interface FAQDetailProps {
    question?: string;
    answer: string;
  }

  const FAQDetail: React.FC<FAQDetailProps> = ({ question, answer }) => {

    const correo = "adoptamena@gmail.com"
    const asunto = "Consulta desde Adoptamena."
    const mensaje = "Hola, estoy interesado en Auspiciar su plataforma..."


    const renderers = {
      a: (props: any) => {
        if (props.href && props.href.startsWith('/')) {
          return (
            <Link href={props.href}>
              <span className="text-blue">{props.children}</span>
            </Link>
          );
        }

        if (props.href && props.href.startsWith('mailto:')) {
          return (
            <span
              className="text-blue cursor-pointer"
              onClick={() => handleContactClick(props.href.replace('mailto:', 'mailto:' + correo), asunto, mensaje)}
            >
              {props.children}
            </span>
          );
        }
  
        return (
          <a href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {props.children}
          </a>
        );
      },
    };
  
    return (
      <div className="mt-4">
        {question && (
          <p>
            <b className="text-lg">{question}</b>
            <br />
          </p>
        )}
  
        <ReactMarkdown
          children={answer}
          rehypePlugins={[rehypeRaw]} // Esto permite el HTML en Markdown
          components={renderers} // Usa nuestro renderizador personalizado
        />
        <br />
      </div>
    );
  };
  
  export default FAQDetail;