import donationsData from '@/lib/donations.json'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { TriangleAlert } from 'lucide-react';
import ImageComponent from '@/components/image-component';

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
            <ImageComponent src="/donations/donations.png"/>

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
            

            <div className='border-[3px] rounded-[32px] flex items-center p-10 my-20' style={{ borderColor: "#FFAE34" }}>
              <TriangleAlert className="w-48 h-48 mr-8" style={{ color: "#FFAE34" }}/>
              
              <div className='text-3xl'>
                {donationsData.length > 0 && donationsData.map((section) => (
                  section.warning
                ))}
              </div>
              
            </div>
          </div>
        </div>
    )
}