'use client';

import Banners from '@/components/banners';
import { useEffect, useState } from 'react';
import { Section } from '@/components/section';
import { getPosts } from '@/utils/posts.http';
import { getPetsByUserId } from '@/utils/pets.http';
import { getUserProfile } from '@/utils/user-profile-client';
import { UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
import { DropdownMenuButtons } from '@/components/profile/dropdown-buttons';
import ReportButton from '@/components/buttons/report-button';
import NotFound from '@/app/not-found';
import { User } from '@/types/auth';
import { getUser } from '@/utils/user-client';
import MenuButton from '@/components/buttons/menu-button';
import PostLocationMap from '@/components/post/post-location-map';

const getUserProfileData = async (
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ user: boolean; pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {

    try {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);

    } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setErrors(prevErrors => ({ ...prevErrors, userProfile: true }));
    } finally {
        setLoading(false);
    }
};

const getPostsData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ user: boolean; pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {
    try {
        // Cargar posts del usuario
        const postParams = { user: userId }; // Usamos el ID del usuario actual
        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prevErrors => ({ ...prevErrors, posts: true }));
    } finally {
        setLoading(false);
    }
};

const getPetsData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ user: boolean; pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {
    try {
        const petData = await getPetsByUserId(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prevErrors => ({ ...prevErrors, pets: true }));
    } finally {
        setLoading(false);
    }
};

const getUserData = async (setUser: React.Dispatch<React.SetStateAction<User | undefined>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ user: boolean; pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {
    try {
        const userData = await getUser(userId);
        setUser(userData);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prevErrors => ({ ...prevErrors, user: true }));
    } finally {
        setLoading(false);
    }
};

export default function ProfilePage() {
    const { user: userAuth, loading: loadingAuth } = useAuth();
    const [user, setUser] = useState<User>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const param = useParams()
    const [errors, setErrors] = useState({
        user: false,
        pets: false,
        posts: false,
        userProfile: false
    });
    const handleContactClick = () => {

        const destinatario = userProfile?.email;
        const asunto = "Consulta desde Adoptamena";
        const mensaje = "Hola, tengo una consulta sobre...";
        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
        window.location.href = mailtoUrl;
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = userProfile?.phoneNumber;
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');  // Esto abrirá WhatsApp en una nueva pestaña
    };

    useEffect(() => {
        const userId = param.id;
        if (!userId) {
            setErrors(prevErrors => ({ ...prevErrors, userProfile: true }));
            return;
        }
        if (userAuth && userId == userAuth.id) {
            router.push('/profile');
        }
        getUserProfileData(
            setUserProfile,
            setLoading,
            setErrors,
            userId.toString()
        );
    }, [userAuth, loadingAuth, param.id]);
    useEffect(() => {
        const userId = param.id;
        if (!userId) {
            setErrors(prevErrors => ({ ...prevErrors, userProfile: true }));
            return;
        }
        getPetsData(
            setPets,
            setLoading,
            setErrors,
            userId.toString()
        );
    }, []);
    useEffect(() => {
        const userId = param.id;
        if (!userId) {
            setErrors(prevErrors => ({ ...prevErrors, userProfile: true }));
            return;
        }

        getPostsData(
            setPosts,
            setLoading,
            setErrors,
            userId.toString()
        );
    }, []);
    useEffect(() => {
        const userId = param.id;
        if (!userId) {
            setErrors(prevErrors => ({ ...prevErrors, userProfile: true }));
            return;
        }
        getUserData(
            setUser,
            setLoading,
            setErrors,
            userId.toString()
        );
    }, []);

    if (loading) {
        return <Loading />;
    }
    if ((errors.userProfile || !user) && !loading) {
        console.log(errors.userProfile, user, loading)
        return NotFound();
    }

    const isOrganization = !!userProfile?.organizationName?.trim();

    const isFundraisingActive = true;
    const fundraisingTitle = 'Recaudacion para vacunar animales Callejeros';

    return (
        <div className="w-full font-roboto">
            {/* Banner */}

            <Banners images={userProfile?.media?.map((item: any) => item.url) || ['./logo.png']} />

            <div className="bg-white rounded-t-[60px] -mt-12 relative z-50 shadow-2xl shadow-gray-800">
                <div className="grid grid-cols-1 gap-4 p-6">
                    <Detail
                        posts={posts}
                        user={user!}
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        isDisable={true}
                        validationErrors={validationErrors}
                        donatedAmount={1000000}
                        goalAmount={17000000}
                        isFundraisingActive={isFundraisingActive}
                        fundraisingTitle={"asdfasdf"}
                    />

                    <div className=" relative md:top-[-20rem]  lg:top-[-12rem] mr-16  flex justify-end gap-2 items-center ">
                        <ReportButton size="lg" />
                        <DropdownMenuButtons handleContactClick={handleContactClick} handleWhatsAppClick={handleWhatsAppClick} userProfile={userProfile} />
                        <MenuButton size="lg" />
                    </div>







                    {/* Mostrar el mapa si las coordenadas están disponibles */}
                    {userProfile?.addressCoordinates && (
                        <div className='w-[40vw] mt-[-70px] '>
                            <PostLocationMap location={userProfile?.addressCoordinates} />
                        </div>
                    )}

                    {/* Mostrar el nombre de la organización en lugar del nombre del usuario */}
                    <Section
                        title={`Mascotas de ${isOrganization ? userProfile?.organizationName : userProfile?.fullName?.split(' ')[0]}`}
                        itemType="pet"
                        path={`/profile/my-pets/${user?.id}`}
                        items={pets}
                        loading={loading}
                        error={errors.pets}
                        filterByType={false}
                    />

                    <Section
                        title={`Publicaciones de ${isOrganization ? userProfile?.organizationName : userProfile?.fullName?.split(' ')[0]}`}
                        itemType="post"
                        postTypeName="adoption"
                        path={`/profile/my-posts/${user?.id ?? ''}`}
                        items={posts}
                        loading={loading}
                        error={errors.posts}
                        filterByType={false}
                    />

                </div>

            </div>

        </div>
    );
}
