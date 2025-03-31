import Image from 'next/image';
import { useState } from 'react';
import donationsData from '@/lib/donations.json'
import Link from 'next/link';
import { handleContactClick } from '@/utils/email-handler';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Page() {

    const renderers = {
        a: (props: any) => {
          if (props.href && props.href.startsWith('/')) {
            return (
              <Link href={props.href}>
                <span className="text-blue">{props.children}</span>
              </Link>
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
        <div className="w-full px-12">
              <Image
                src="/donations/donations.png"
                alt=""
                width={1341}
                height={435}
                layout="intrinsic"
                className="rounded-[32px] mx-auto w-full max-w-screen-lg mt-8"
              />

            <div className="mt-36 px-4 md:px-16">

                {donationsData.length > 0 && donationsData.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-8">
      
                        <h2 className="mb-10 text-3xl text-center font-bold">{section.title}</h2>

                        {section.items.map((item, itemIndex) => (

                        
                            <div key={itemIndex} className="mt-4 text-2xl mb-10 px-20">
                                <ReactMarkdown
                                  children={item.detail}
                                  rehypePlugins={[rehypeRaw]} // Esto permite el HTML en Markdown
                                  components={renderers} // Usa nuestro renderizador personalizado
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/*Aqui debe ir el div con borde redondeado y logo con texto */}
        </div>
    )
}