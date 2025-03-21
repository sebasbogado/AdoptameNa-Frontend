import { useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";

interface PostButtonsProps {
    isPet?: boolean;
}
const PostButtons = ({ isPet = false }: PostButtonsProps) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    return (
        <div className="m-4 gap-3 flex justify-end h-12 relative pr-12">
            {
                isPet && (
                    <Button variant="cta" size="lg">Adoptar</Button>

                )
            }

            <div className="relative">
                <SendButton size="lg" onClick={handleShare} disabled={copied} />
                {copied && (
                    <Alert color="gray" className=" absolute top-[-100px] left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2">
                        ¡Enlace copiado al portapapeles!
                    </Alert>
                )}
            </div>

            <ReportButton size="lg" />
        </div>
    );
};

export default PostButtons;