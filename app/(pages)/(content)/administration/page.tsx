import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbar-admin";

export default function Page() {
    return (<>
        <div className="flex flex-col items-center justify-center">
            <NavbarAdmin/>
        </div>
        <div>
            Administration
            <Footer/>
        </div>
        </>

    )
}