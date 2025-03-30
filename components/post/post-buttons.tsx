import { useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";
import FavoriteButton from "../buttons/favorite-button";
import { useAuth } from "@/contexts/auth-context";
import { sharePost } from "@/utils/posts.http";

interface PostButtonsProps {
    postId: string | undefined;
    isPet?: boolean;
}
const PostButtons = ({ isPet = false, postId }: PostButtonsProps) => {
    const { authToken } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if(!postId) return;

        if(authToken && isPet===false) {
            await sharePost(postId, authToken);
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        } catch (error) {
            console.error("Error al copiar al portapapeles:", error);
        }
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

            <FavoriteButton size="lg" className="relative top-[-60px] shadow-md left-[40px]" />
        </div>
    );
};

export default PostButtons;