'use client';

import Button from '@/components/buttons/button';
import EditButton from '@/components/buttons/edit-button';
import MenuButton from '@/components/buttons/menu-button';
import Banners from '@/components/banners';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer';
import { Section } from '@/components/section';
import { ConfirmationModal } from "@/components/form/modal";

import { getPosts } from '@/utils/posts.http';
import { getPetsByUserId } from '@/utils/pets.http';
import { getUserProfile, updateUserProfile } from '@/utils/user-profile-client';
import { UpdateUserProfile, UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { Mail, Phone, SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { profileSchema } from '@/validations/user-profile';
import { DropdownMenuButtons } from '@/components/profile/dropdown-buttons';
import ReportButton from '@/components/buttons/report-button';
const getUserProfileData = async (

    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<Boolean>>,
    userId: string,
) => {

    try {
        // Cargar perfil de usuario
        const profile = await getUserProfile(userId);
        setUserProfile(profile);

    } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setErrors(prevErrors => ({ ...prevErrors, userProfile: true}));
    } finally {
        setLoading(false);
    }
};

const getPostsData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<Boolean>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const postParams = { user: userId }; // Usamos el ID del usuario actual
        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prevErrors => ({ ...prevErrors, posts: true}));
    } finally {
        setLoading(false);
    }
};
const getPetsData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<Boolean>>,
    userId: string,
) => {


    try {
        const petData = await getPetsByUserId(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prevErrors => ({ ...prevErrors, pets: true}));
    } finally {
        setLoading(false);
    }
};

export default function ProfilePage() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [tempUserProfile, setTempUserProfile] = useState<UserProfile | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isOpen , setIsOpen] = useState(false)   
    const param = useParams()
    const [errors, setErrors] = useState({
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

    if (authLoading || loading) {
        return <Loading />;
    }
    if (!user) return;
    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={userProfile?.bannerImages || ['/logo.png']} />
          
            <Detail
                posts={posts} user={user}
                userProfile={ userProfile}
                setUserProfile={setTempUserProfile}
                isDisable={false}
                validationErrors={validationErrors}
            />
            {/* Action Buttons */}
            <div className=" relative md:top-[-20rem]  lg:top-[-12rem] mr-16  flex justify-end gap-2 items-center ">
            <ReportButton size="lg" />
                   <DropdownMenuButtons handleContactClick={handleContactClick} handleWhatsAppClick={handleWhatsAppClick} userProfile={userProfile}></DropdownMenuButtons>
            </div>
            {/* Pets Section */}
            <Section
                title="Mis Mascotas"
                itemType="pet"
                path={`/profile/my-pets/${user.id}`}
                items={pets}
                loading={loading}
                error={errors.pets}
                filterByType={false}
            />

            {/* Posts Section (Con filtrado) */}
            <Section
                title={`Publicaciones de ${user?.fullName.split(' ')[0]}`}
                itemType="post"
                postTypeName="adoption"
                path={`/profile/my-posts/${user.id}`}
                items={posts}
                loading={loading}
                error={errors.posts}
                filterByType={false}
            />
        </div>
    );
}
