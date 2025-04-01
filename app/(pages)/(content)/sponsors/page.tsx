import Image from 'next/image';
import sponsorsData from '@/lib/sponsors.json'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Page() {
    return (
        <div className="w-full px-12">
          <Image
            src="/sponsor/sponsor.png"
            alt=""
            width={1341}
            height={435}
            layout="intrinsic"
            className="rounded-[32px] mx-auto w-full max-w-screen-lg mt-8"
          />

          <div className='text-2xl text-center px-72 my-20'>
            {sponsorsData.map((item, index) => (
              <div key={index}>
                {item.blocks.map((block, blockIndex) => (
                  <div key={blockIndex}>

                    {block.upDetails && (
                      <div>
                        {block.upDetails.map((detail, idx) => (
                          <div key={idx}>{detail.detail}</div>
                        ))}
                      </div>
                    )}

                    {blockIndex === 0 && <div className="">LOGOS</div>}

                    {block.downDetails && (
                      <div>
                        {block.downDetails.map((detail, idx) => (
                          <div key={idx}>{detail.detail}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

         
        </div>
    )
}