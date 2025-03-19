

export default function SectionAdmin({ children, title }: { children: React.ReactNode; title: string} ) {
    return (
        <section>
            <h1 className="text-2xl font-black ">{title}</h1>
            <p>{children}</p>
        </section>
    )
}