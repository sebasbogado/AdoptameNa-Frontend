import React, { useState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "@/components/buttons/button";

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    userFullName: string;
    userEmail: string;
    currentRole: string; // "regular" o "admin"
    roles: string[];      // ej. ["regular", "admin"]
    onSave: (newRole: string) => void; // se llama al hacer clic en Guardar
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
    isOpen,
    onClose,
    userFullName,
    userEmail,
    currentRole,
    roles,
    onSave,
}) => {
    const [selectedRole, setSelectedRole] = useState<string>(currentRole);

    useEffect(() => {
        if (isOpen) setSelectedRole(currentRole);
    }, [isOpen, currentRole]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedRole);
        onClose();
    };

    const mapDisplayRoleToDb = (displayRole: string) =>
        displayRole === "admin" ? "admin" : "user";


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar rol de usuario">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p className="font-medium">Nombre:</p>
                    <p className="mb-2">{userFullName}</p>
                    <p className="font-medium">Correo:</p>
                    <p>{userEmail}</p>
                </div>

                <div>
                    <label htmlFor="role-select" className="block font-medium mb-1">
                        Rol actual:
                    </label>
                    <select
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" size="md" onClick={onClose} type="button">
                        Cancelar
                    </Button>
                    <Button
                        variant="cta"
                        size="md"
                        type="submit"
                        disabled={mapDisplayRoleToDb(selectedRole) === currentRole}
                        className={mapDisplayRoleToDb(selectedRole) === currentRole ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Guardar
                    </Button>

                </div>
            </form>
        </Modal>
    );
};

export default ChangeRoleModal;
