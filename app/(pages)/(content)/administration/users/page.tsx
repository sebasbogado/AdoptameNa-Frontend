"use client"
import { useEffect, useState } from "react"
import { getUsers, deleteUser } from "@/utils/user-client"
import { getUserProfiles } from "@/utils/user-profile-client"
import UserTable from "@/components/administration/user/user-table"
import { UserList, UserProfile } from "@/types/user-profile"
import { useAuth } from "@/contexts/auth-context"
import { ConfirmationModal } from "@/components/form/modal"
import { Alert } from "@material-tailwind/react"


export default function Page() {
  const [users, setUsers] = useState<UserList[]>();
  const [admins, setAdmins] = useState<UserList[]>();
  const [organizations, setOrganizations] = useState<UserList[]>();
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { authToken } = useAuth()
  const params: any = { "page": 0, "size": 100 }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers(params)
        const profiles = await getUserProfiles(params)

        const UserListRaw: UserList[] = users.map((user: any) => ({
          id: user.id,
          fullName: profiles.find((profile: UserProfile) => profile.id === user.id)?.fullName,
          email: user.email,
          role: user.role,
          creationDate: formatDate(user.creationDate),
        }))

        let listUser: UserList[] = []
        let listAdmin: UserList[] = []
        let listOrganization: UserList[] = []
        for (const user of UserListRaw) {
          if (user.role === "admin") {
            listAdmin.push(user)
          } else if (user.role === "user") {
            listUser.push(user)
          } else if (user.role === "organization") {
            listOrganization.push(user)
          }
        }
        setUsers(listUser)
        setAdmins(listAdmin)
        setOrganizations(listOrganization)

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchData()
  }, [authToken])

  const handleDelete = async () => {
    if (!authToken || !selectedUser) return;
    try {
      await deleteUser(authToken, selectedUser);
      const updatedUsers = users?.filter((user) => user.id !== selectedUser);
      setUsers(updatedUsers);
      setSuccessMessage("Usuario eliminado correctamente");
    } catch (error: any) {
      setErrorMessage("Error al eliminar el usuario");
      console.error("Error deleting user:", error);
    } finally {
      setModalConfirmation(false);
      setSelectedUser(null);
    }
  }

  return (
    <div className="mt-8">
      {successMessage && (
        <div>
          <Alert
            color="green"
            onClose={() => setSuccessMessage("")}
            className="fixed top-4 right-4 w-75 shadow-lg z-[60]">
            {successMessage}
          </Alert>
        </div>
      )}
      {errorMessage && (
        <div>
          <Alert
            color="red"
            onClose={() => setErrorMessage("")}
            className="fixed top-4 right-4 w-75 shadow-lg z-[60]">
            {errorMessage}
          </Alert>
        </div>
      )}
      <ConfirmationModal
        isOpen={modalConfirmation}
        onClose={() => { setSelectedUser(null); setModalConfirmation(false) }}
        onConfirm={handleDelete}
        message="¿Estás seguro de que deseas eliminar este usuario?"
        title="Eliminar Usuario"
        textConfirm="Eliminar"
      />

      <UserTable
        title="Administradores"
        data={admins || []}
        onDelete={(id) => {
          setSelectedUser(id);
          setModalConfirmation(true)
        }}
      />

      <UserTable
        title="Organizaciones"
        data={organizations || []}
        onDelete={(id) => {
          setSelectedUser(id);
          setModalConfirmation(true)
        }}
      />

      <UserTable
        title="Lista de Usuarios"
        data={users || []}
        onDelete={(id) => {
          setSelectedUser(id);
          setModalConfirmation(true)
        }}
      />
    </div>)
}