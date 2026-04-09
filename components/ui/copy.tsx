import { IoCopyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { useState, useRef, type ReactNode } from "react";

function CopyToClipboard(props: { children: ReactNode, className?: string }) {

    const [isCopied, setIsCopied] = useState(false);
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleClick = async () => {
        setIsCopied(true);

        if (divRef.current) {
            const textToCopy = divRef.current.innerText;
            await navigator.clipboard.writeText(textToCopy);
        }

        setTimeout(() => {
            setIsCopied(false);
        }, 500);
    }

    return (
        <div
            className={`flex items-center gap-2 ${props.className}`}
            onClick={handleClick}>
                {isCopied ? <IoCheckmarkCircleOutline /> : <IoCopyOutline />}
            <div ref={divRef}>
                {props.children}
            </div>
        </div>
    )
}

export default CopyToClipboard