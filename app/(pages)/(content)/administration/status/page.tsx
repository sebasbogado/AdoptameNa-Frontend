import AnimalStatusList from "./animal-list"

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <AnimalStatusList />
            </div>
        </main>
    )
}