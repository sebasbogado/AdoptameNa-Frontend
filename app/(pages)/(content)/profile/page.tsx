'use client';

import EditButton from '@/components/buttons/edit-button';
import { useEffect, useState } from 'react';
import { Section } from '@/components/section';
import { ConfirmationModal } from "@/components/form/modal";

import { getPosts } from '@/utils/posts.http';
import { getPets } from '@/utils/pets.http';
import { getUserProfile, updateUserProfile } from '@/utils/user-profile.http';
import { MediaDTO, UpdateUserProfile, UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
import { profileEditSchema } from '@/validations/user-profile';
import PostLocationMap from '@/components/post/post-location-map';
import HeaderImage from '@/components/image-header';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/product.http';
import EditProfileModal from '@/components/profile/edit-profile-modal'

type ErrorsType = {
    user: boolean;
    pets: boolean;
    posts: boolean;
    userProfile: boolean;
    marketplacePosts: boolean;
};
const getProductsData = async (
    setMarketplacePosts: React.Dispatch<React.SetStateAction<Product[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const queryParams = {
            page: 0,
            size: 5,
            sort: "id,desc",
            userId: Number(userId)
        }; // Usamos el ID del usuario actual

        const response = await getProducts(queryParams);
        setMarketplacePosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
        setErrors(prev => ({ ...prev, posts: true }));
    } finally {
        setLoading(false);
    }
};


const getUserProfileData = async (
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>,
    userId: string,
) => {
    try {
        // Cargar perfil de usuario
        const profile = await getUserProfile(userId);
        setUserProfile(profile);

    } catch (err) {
        setErrors(prev => ({ ...prev, userProfile: true }));
    } finally {
        setLoading(false);
    }
};

const getPostsData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const postParams = {
            page: 0,
            size: 5,
            sort: "id,desc",
            userId: Number(userId)
        }; // Usamos el ID del usuario actual

        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData.data) ? postData.data : []);
    } catch (err) {
        setErrors(prev => ({ ...prev, posts: true }));
    } finally {
        setLoading(false);
    }
};
const getPetsData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<ErrorsType>>,
    userId: string,
) => {


    try {
        const postParams = {
            page: 0,
            size: 5,
            sort: "id,desc",
            userId: Number(userId)
        }; // Usamos el ID del usuario actual

        const petData = await getPets(postParams);
        setPets(Array.isArray(petData.data) ? petData.data : []);
    } catch (err) {
        setErrors(prev => ({ ...prev, pets: true }));
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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)
    const [tempUserProfile, setTempUserProfile] = useState<UserProfile | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false)
    const [errors, setErrors] = useState({
        user: false,
        pets: false,
        posts: false,
        userProfile: false,
        marketplacePosts: false,
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [medias, setMedias] = useState<MediaDTO[]>([])
    const [marketplacePosts, setMarketplacePosts] = useState<Product[]>([]);

    const updateProfile = async (profileToUpdate: UpdateUserProfile) => {
        if (authLoading || !authToken || !user?.id) return;
        if (!validateProfile(profileToUpdate)) {
            setIsEditing(true)
            return
        }
        setProfileLoading(true);
        setErrors(prev => ({ ...prev, userProfile: false }));

        try {
            const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
            setUserProfile(updatedProfile); // Actualizamos el estado después de recibir la respuesta
        } catch (err) {
            setErrors(prev => ({ ...prev, userProfile: true }));

        } finally {
            setProfileLoading(false);
        }
    };

    const handleEditButtonClick = () => {

        if (!isEditing) {
            setTempUserProfile(userProfile); // Guardar valores originales
        }
        setValidationErrors({});
        setIsEditing(!isEditing);

    };


    const handleSaveButtonClick = () => {
        setIsOpen(true); // Abre el modal de confirmación
    };

    const handleConfirmSave = async () => {
        setIsOpen(false); // Cierra el modal
        setIsEditing(false);
        if (tempUserProfile) {
            await updateProfile(tempUserProfile);
        }
    };

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
            return;
        }
        if (authLoading || !authToken || !user?.id) return;
        setLoading(true);

        getUserProfileData(
            setUserProfile,
            setProfileLoading,
            setErrors,
            String(user.id)
        );
    }, [authToken, authLoading, user?.id, router]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        setLoading(true);
        setErrors(prev => ({ ...prev, pets: false }));
        getPetsData(setPets, setLoading, setErrors, String(user.id)
        );

    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        getPostsData(setPosts, setLoading, setErrors, String(user.id)
        );
    }, [authToken, authLoading, user?.id]);
    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;

        getProductsData(setMarketplacePosts, setLoading, setErrors, String(user.id));

    }, [authToken, authLoading, user?.id]);

    const handleContactClick = () => {

        const destinatario = userProfile?.email;
        const asunto = "Consulta desde Adoptamena";
        const mensaje = "Hola, tengo una consulta sobre...";


        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;


        window.location.href = mailtoUrl;
    };


    const validateProfile = (profileData: UpdateUserProfile) => {
        const result = profileEditSchema.safeParse(profileData);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                errors[err.path[0]] = err.message;
            });
            setValidationErrors(errors);
            return false;
        }
        setValidationErrors({});
        return true;
    };

    useEffect(() => {
        if (userProfile) {
            setMedias(userProfile.media ?? []);
        }
    }, [userProfile?.media]);

    if (authLoading || loading) {
        return <Loading />;
    }

    if (!user) {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("redirectTo", window.location.pathname);
        }
        router.push("/auth/login");
        return;
      }

    const isOrganization = !!userProfile?.organizationName?.trim();

    return (
        <div className="w-full font-roboto">
            {/* Banner */}

            <HeaderImage
                isEditEnabled={true}
                userProfile={userProfile}
                medias={medias}
                setMedias={setMedias}
            />

            {isOpen &&
                <ConfirmationModal
                    isOpen={isOpen}
                    title="Confirmar cambios"
                    message="¿Estás seguro de que deseas guardar los cambios?"
                    textConfirm="Confirmar cambios"
                    confirmVariant="cta"
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirmSave}
                />}
            <div className="bg-white rounded-t-[60px] -mt-12 relative z-50">
                <div className="grid grid-cols-1 gap-4 p-6">

                    {/* User Info */}
                    <Detail
                        posts={posts} user={user}
                        userProfile={isEditing ? tempUserProfile : userProfile}
                        setUserProfile={setTempUserProfile}
                        isDisable={!isEditing}
                        validationErrors={validationErrors}
                        setSuccessMessage={setSuccessMessage}
                        setErrorMessage={setErrorMessage}
                    />

                    {/* Action Buttons */}
                    <div className="relative top-[-25vh] right-5 mr-10 mt-12  flex justify-end gap-2 items-center" style={{ position: 'absolute', top: '0%', right: '20px' }}>

                        <EditButton
                            size="lg"
                            isEditing={false}
                            id="edit-button"
                            onClick={() => setShowEditModal(true)}
                        />
                    </div>

                    <div className='w-[40vw] mt-[-30px] '>
                        <PostLocationMap location={userProfile?.addressCoordinates ?? undefined} />

                    </div>

                    {/* Pets Section */}
                    <Section
                        title="Mis Mascotas"
                        itemType="pet"
                        postTypeName="Adopcion"
                        path={`/profile/my-pets/${user.id}`}
                        items={pets}
                        loading={loading}
                        error={errors.pets}
                    />

                    {/* Posts Section (Con filtrado) */}
                    <Section
                        title={"Mis publicaciones"}
                        itemType="post"
                        postTypeName="Adopcion"
                        path={`/profile/my-posts/${user.id}`}
                        items={posts}
                        loading={loading}
                        error={errors.posts}
                    />
                    <Section
                        title='Mis productos'
                        path={`/profile/my-products/${user.id}`}
                        itemType='product'
                        postTypeName="Marketplace"
                        items={marketplacePosts}
                        loading={loading}
                        error={errors.marketplacePosts}>
                    </Section>


                    <EditProfileModal
                        open={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        initialData={{
                            fullName: userProfile?.fullName ?? "",
                            phoneNumber: userProfile?.phoneNumber ?? null,
                            address: userProfile?.address ?? null,
                            gender: (userProfile?.gender ?? "MALE") as "MALE" | "FEMALE" | "OTHER",
                            birthdate: userProfile?.birthdate
                                ? new Date(userProfile.birthdate)
                                : null,
                            description: userProfile?.description ?? "",
                            addressCoordinates: userProfile?.addressCoordinates
                                ? userProfile.addressCoordinates.split(",").map(parseFloat)
                                : undefined,
                            departmentId: userProfile?.departmentId ?? undefined,
                            districtId: userProfile?.districtId ?? undefined,
                            neighborhoodId: userProfile?.neighborhoodId ?? undefined,
                            organizationName: userProfile?.organizationName ?? "",
                        }}
                        onSuccess={() =>
                            getUserProfileData(
                                setUserProfile,
                                setProfileLoading,
                                setErrors,
                                String(user.id)
                            )
                        }
                        setSuccessMessage={setSuccessMessage}
                        setErrorMessage={setErrorMessage}
                    />
                </div>
            </div>
        </div>
    );
}

