import Button from '@/components/buttons/button';
import Image from 'next/image';

export default function Page() {
    return (
        <div className="relative h-screen">
            <Image 
                src="/faq/faq.png" 
                alt=""
                width={1341}  
                height={435}
                className='relative rounded-[32px] top-[100px] left-[50px]'  
            />
{/*
                <div className="relative">
                    <input
                        className="relative w-[756px] h-[56px] top-[20px] left-[20px] bg-white rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]" 
                    />
                    <Button>
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </Button>
                </div>*/}

<div className="relative top-[80px] left-[340px]">
    <div className="relative flex items-center w-[756px]">
        <input
                        className="w-[756px] h-[56px] bg-white top-[515px] left-[342px] rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]"
                        type="text"
                        placeholder="Search..."
        />
            <button className="absolute right-0 top-0 bottom-0 px-[20px] bg-blue-500 text-gray-500 rounded-r-[6px]">
                        <span className="material-symbols-outlined">search</span>
            </button>
        
    </div>
</div>


            </div>
    );
}
