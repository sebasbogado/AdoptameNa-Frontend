"use client"

import Card from "@/components/card"
import { Animal } from "@/types/animal";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import { useAuth } from "@/contexts/authContext";
import { getAnimals, createAnimal, deleteAnimal, updateAnimal } from "@/utils/animals.http";
import { getPetStatuses, createPetStatus, updatePetStatus, deletePetStatus } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";
import FormAnimals from "@/components/form-animal";
import FormPetStatus from "@/components/form-pet-status";
import PetBreeds from "@/components/pet-breeds";
import { Alert } from "@material-tailwind/react";
import { ConfirmationModal } from "@/components/form/modal";

export default function page() {
  const [modalAnimal, setModalAnimal] = useState(false);
  const [modalPetStatus, setModalPetStatus] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [petStatuses, setPetStatuses] = useState<PetStatus[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [animalSelected, setAnimalSelected] = useState<Animal>({ id: 0, name: "" });
  const [petStatusSelected, setPetStatusSelected] = useState<PetStatus>({ id: 0, name: "", description: "" });
  const [deleteType, setDeleteType] = useState<"animal" | "petStatus" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { authToken, user } = useAuth();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        if (!authToken || !user || user.role !== "admin") return;
        const animals = await getAnimals();
        const petStatuses = await getPetStatuses();

        setAnimals(animals);
        setPetStatuses(petStatuses);
      } catch (error: any) {
        console.error('Error al obtener animales:', error);
        setErrorMessage(error.message);
      }
    }
    fetchAnimals();
  }, [authToken])

  const handleSubmitAnimal = async (newAnimal: Animal) => {
    try {
      if (!authToken) return;
      if (newAnimal.id) {
        //actualizar animal
        await updateAnimal(authToken, newAnimal);
        setAnimals(animals.map((animal) => animal.id === newAnimal.id ? newAnimal : animal));
        setModalAnimal(false);
        setSuccessMessage("Animal actualizado correctamente");
        return;
      } else {
        const { id, ...animalData } = newAnimal;
        const animal = await createAnimal(authToken, animalData);
        setAnimals([...animals, animal]);
        setModalAnimal(false);
        setSuccessMessage("Animal creado correctamente");
      }
    } catch (error: any) {
      console.error('Error al guardar animal:', error);
      setErrorMessage(error.message);
    }
  }

  const handleDeleteAnimal = async (event: React.FormEvent) => {
    event.preventDefault();
    if (animalSelected.id === 0) {
      setModalAnimal(false);
      return;
    }
    setDeleteType("animal");
    setIsOpenModal(true);
    return;
  }

  const openEditAnimal = (animal: Animal) => {
    setAnimalSelected(animal);
    setModalAnimal(true);
  }

  const openEditPetStatus = (petStatus: PetStatus) => {
    setPetStatusSelected(petStatus);
    setModalPetStatus(true);
  }

  const handleSubmitPetStatus = async (newPetStatus: PetStatus) => {
    try {
      if (!authToken) return;
      if (newPetStatus.id) {
        //actualizar estado
        await updatePetStatus(authToken, newPetStatus);
        //actualizar lista de estados
        setPetStatuses(petStatuses.map((petStatus) => petStatus.id === newPetStatus.id ? newPetStatus : petStatus));
        setModalPetStatus(false);
        setSuccessMessage("Estado actualizado correctamente");
        return;
      } else {
        const petStatus = await createPetStatus(authToken, newPetStatus);
        //actualizar lista de estados
        setPetStatuses([...petStatuses, petStatus]);
        setModalPetStatus(false);
        setSuccessMessage("Estado creado correctamente");
      }
      //crear estado
    } catch (error: any) {
      console.error('Error al crear estado:', error);
      setErrorMessage(error.message);
    }
  }

  const handleDeletePetStatus = async (event: React.FormEvent) => {
    event.preventDefault();
    if (petStatusSelected.id === 0) {
      setModalPetStatus(false);
      return;
    }
    setIsOpenModal(true);
    return;
  }
  const confirmDeleteAnimal = async () => {
    try {
      if (!authToken) return;
      //eliminar animal
      await deleteAnimal(authToken, animalSelected.id);
      //actualizar lista de animales
      setAnimals(animals.filter((animal) => animal.id !== animalSelected.id));
      setModalAnimal(false);
      setSuccessMessage("Animal eliminado correctamente");
    } catch (error: any) {
      console.error('Error al eliminar animal:', error);
      setErrorMessage(error.message);
    } finally {
      setIsOpenModal(false);
    }
  }

  const confirmDeletePetStatus = async () => {
    try {
      if (!authToken) return;
      //eliminar estado
      await deletePetStatus(authToken, petStatusSelected.id);
      //actualizar lista de estados
      setPetStatuses(petStatuses.filter((petStatus) => petStatus.id !== petStatusSelected.id));
      setModalPetStatus(false);
      setSuccessMessage("Estado eliminado correctamente");
    } catch (error: any) {
      console.error('Error al eliminar estado:', error);
      setErrorMessage(error.message);
    } finally {
      setIsOpenModal(false);
      setModalAnimal(false)
    }
  }
  const onClickLabelAddAnimal = () => {
    setAnimalSelected({ id: 0, name: "" });
    setModalAnimal(true);
  }

  const onClickLabelAddPetStatus = () => {
    setPetStatusSelected({ id: 0, name: "", description: "" });
    setModalPetStatus(true);
  }
  return (
    <>
      {successMessage && (
        <Alert
          color="green"
          className="fixed top-4 right-4 z-[10001] w-72 shadow-lg"
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          color="red"
          className="fixed top-4 right-4 z-[10001] w-72 shadow-lg"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}
      <div className="rounded-lg  p-6">
        <div className="flex justify-center gap-3">
          {/*Modal Section */}
          <Modal isOpen={modalAnimal} onClose={() => setModalAnimal(false)} title={animalSelected.id === 0 ? "Crear animal" : "Editar animal"}>
            <FormAnimals onCreate={handleSubmitAnimal} onDelete={handleDeleteAnimal} animalData={animalSelected} />
          </Modal>
          <Modal isOpen={modalPetStatus} onClose={() => setModalPetStatus(false)} title={petStatusSelected.id === 0 ? "Crear estado" : "Editar estado"}>
            <FormPetStatus onCreate={handleSubmitPetStatus} onDelete={handleDeletePetStatus} petStatusData={petStatusSelected} />
          </Modal>

          <ConfirmationModal
            isOpen={isOpenModal}
            title="Eliminar"
            message={`¿Estás seguro de que deseas eliminar este ${deleteType === "animal" ? "animal" : "estado"}?`}
            textConfirm="Eliminar"
            confirmVariant="danger"
            onClose={() => {setIsOpenModal(false); setDeleteType(null);}}
            onConfirm={deleteType === "animal" ? confirmDeleteAnimal : confirmDeletePetStatus}
          />

          {/**Cards*/}
          <Card
            title="Animales"
            content={animals}
            isBreed={false}
            onClickLabelDefault={openEditAnimal}
            onClickLabelAdd={onClickLabelAddAnimal}
          />
          <Card
            title="Estados de mascotas"
            content={petStatuses}
            isBreed={false}
            onClickLabelDefault={openEditPetStatus}
            onClickLabelAdd={onClickLabelAddPetStatus}
          />
        </div>
        <div className="flex justify-center mt-10">
          <PetBreeds />
        </div>
      </div>
    </>
  );
}