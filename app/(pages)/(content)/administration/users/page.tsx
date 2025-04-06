"use client"
import { useEffect, useState } from "react"
import { getUsers, deleteUser } from "@/utils/user-client"
import { getUserProfiles } from "@/utils/user-profile-client"
import UserTable from "@/components/administration/user/user-table"
import { UserList } from "@/types/user-profile"
import { useAuth } from "@/contexts/auth-context"

export default function Page() {
  const [users, setUsers] = useState<UserList[]>();
  const [admins, setAdmins] = useState<UserList[]>();
  const [organizations, setOrganizations] = useState<UserList[]>();
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

        const UserListRaw: any[] = users.map((user: any) => ({
          id: user.id,
          fullName: profiles.find((profile: any) => profile.id === user.id)?.fullName,
          email: user.email,
          role: user.role,
          creationDate: formatDate(user.creationDate),
        }))

        let listUser: any[] = []
        let listAdmin: any[] = []
        let listOrganization: any[] = []
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

  const handleDelete = async (id: number) => {
    if (!authToken) return;
    await deleteUser(authToken, id)
    const updatedUsers = users?.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  }

  return (
    <div>
      <UserTable
        title="Administradores"
        data={admins || []}
        onDelete={(id) => {
          const updatedUsers = users?.filter((user) => user.id !== id);
          setUsers(updatedUsers);
        }}
      />

      <UserTable
        title="Organizaciones"
        data={organizations || []}
        onDelete={(id) => {
          const updatedUsers = users?.filter((user) => user.id !== id);
          setUsers(updatedUsers);
        }}
      />

      <UserTable
        title="Lista de Usuarios"
        data={users || []}
        onDelete={(id) => {
          const updatedUsers = users?.filter((user) => user.id !== id);
          setUsers(updatedUsers);
        }}
      />
    </div>)
}