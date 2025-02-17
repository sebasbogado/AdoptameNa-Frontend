export default function AuthLayout({children}){
    return(
        <div className="bg-gray-300 w-screen h-screen flex justify-center items-center">
            <div className="bg-purple-200 rounded-md p-10">
                {children}
            </div>
        </div>
    )
}