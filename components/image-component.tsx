import React from 'react';
import Image from 'next/image';

interface ImageComponentProps {
    src: string;
  }

const ImageComponent: React.FC<ImageComponentProps> = ({ src }) => {
    return (
      <Image
        src={src}
        alt="Imagen FAQ"
        width={1341}
        height={435}
        layout="intrinsic"
        className="rounded-[32px] mx-auto w-full max-w-screen-lg mt-8"
      />
    );
  };
  
  export default ImageComponent;
  