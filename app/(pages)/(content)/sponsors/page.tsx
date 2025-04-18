import Image from 'next/image';
import sponsorsData from '@/lib/sponsors.json'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Button from '@/components/buttons/button';

import sponsorLogosData from '@/lib/sponsors-logos.json';
import ImageComponent from '@/components/image-component';

export default function Page() {
    return (
        <div className="w-full px-12">
          <ImageComponent src="/sponsor/sponsor.png"/>

          <div className='text-2xl text-center px-72 my-10'>
            {sponsorsData.map((item, index) => (
              <div key={index}>
                {item.blocks.map((block, blockIndex) => (
                  <div key={blockIndex}>

                    {block.upDetails && (
                      <div className='mb-10'>
                        {block.upDetails.map((detail, idx) => (
                          <div className='mb-10' key={idx}>{detail.detail}</div>
                        ))}
                      </div>
                    )}

                    {blockIndex === 0 && <div className="mb-8 -ml-40">
                      <h3 className="text-gray-600 mb-8">Auspician este sitio:</h3>
                      <div className="flex gap-32">
                        {sponsorLogosData.map((logo, index) => (
                          <Image 
                            key={index}
                            src={logo.src}
                            alt={`Logo ${index + 1}`}
                            width={parseInt(logo.width)}
                            height={parseInt(logo.height)}
                          />
                        ))}
                      </div>
                    </div>}
                    

                    {block.downDetails && (
                      <div  className='mb-8'>
                        {block.downDetails.map((detail, idx) => (
                          <div className='mb-8' key={idx}>{detail.detail}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

          <Button variant="cta" size='lg' className='my-10'>Quiero ser auspiciante</Button>
          </div>

         
        </div>
    )
}