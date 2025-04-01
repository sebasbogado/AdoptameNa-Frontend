import Image from 'next/image';

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
          </div>
    )
}