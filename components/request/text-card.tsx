const TextCard = ({ title, content}: { title: string|number; content: string }) => {
    return (
         <div className="flex-grow">
                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">{title}:</span></p>
                <p className="text-sm pl-2 text-gray-700  max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mb-2">
                    {content || 'No especificada'}
                </p>
            </div>
    
    )
}
export default TextCard;