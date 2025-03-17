"use client"

import Card  from "../card"
import { Animal } from "@/types/animal";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import { useAuth } from "@/contexts/authContext";
import { getAnimals, createAnimal, deleteAnimal, updateAnimal} from "@/utils/animals.http";
import { getPetStatuses, createPetStatus, updatePetStatus, deletePetStatus} from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";
import FormAnimals from "./form-animal";
import FormPetStatus from "./form-pet-status";
import ConfirmationModal from "@/components/confirm-modal";

export default function page() {
  const [modalAnimal, setModalAnimal] = useState(false);
  const [modalPetStatus, setModalPetStatus] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [petStatuses, setPetStatuses] = useState<PetStatus[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [animalSelected, setAnimalSelected] = useState<Animal>({ id: 0, name: "" });
  const [petStatusSelected, setPetStatusSelected] = useState<PetStatus>({ id: 0, name: "", description: "" });

  const { authToken, user} = useAuth();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        if (!authToken || !user || user.role !== "admin") return;
        const animals = await getAnimals(authToken);
        const petStatuses = await getPetStatuses(authToken);

        setAnimals(animals);
        setPetStatuses(petStatuses);
      } catch (error) {
        console.error('Error al obtener animales:', error);
      }
    }
    fetchAnimals();
  }, [authToken])

  const handleSubmitAnimal = async (newAnimal: Animal) => {
    try {
      if (!authToken) return;
      if (newAnimal.id !== 0) {
        //actualizar animal
        await updateAnimal(authToken, newAnimal);
        //actualizar lista de animales
        setAnimals(animals.map((animal) => animal.id === newAnimal.id ? newAnimal : animal));
        setModalAnimal(false);
        return;
      } else {
        const animal = await createAnimal(authToken, newAnimal);
        //actualizar lista de animales
        setAnimals([...animals, animal]);
        setModalAnimal(false);

      }
      //crear animal
    } catch (error) {
      console.error('Error al crear animal:', error);
    }
  }

  const handleDeleteAnimal = async (event: React.FormEvent) => {
    event.preventDefault();
    if (animalSelected.id === 0) {
      setModalAnimal(false);
      return;
    }
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
      if (newPetStatus.id !== 0) {
        //actualizar estado
        await updatePetStatus(authToken, newPetStatus);
        //actualizar lista de estados
        setPetStatuses(petStatuses.map((petStatus) => petStatus.id === newPetStatus.id ? newPetStatus : petStatus));
        setModalPetStatus(false);
        return;
      } else {
        const petStatus = await createPetStatus(authToken, newPetStatus);
        //actualizar lista de estados
        setPetStatuses([...petStatuses, petStatus]);
        setModalPetStatus(false);
      }
      //crear estado
    } catch (error) {
      console.error('Error al crear estado:', error);
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
    } catch (error) {
      console.error('Error al eliminar animal:', error);
    }finally{
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
    } catch (error) {
      console.error('Error al eliminar estado:', error);
    }finally{
      setIsOpenModal(false);
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
      <div className="rounded-lg border border-gray-900 p-6">

        <div className="flex justify-center">
          {/*Modal Section */}
          <Modal isOpen={modalAnimal} onClose={() => setModalAnimal(false)} title={animalSelected.id === 0 ? "Crear animal" : "Editar animal"}>
            <FormAnimals onCreate={handleSubmitAnimal} onDelete={handleDeleteAnimal} animalData={animalSelected} />
          </Modal>
          <Modal isOpen={modalPetStatus} onClose={() => setModalPetStatus(false)} title={petStatusSelected.id === 0 ? "Crear estado" : "Editar estado"}>
            <FormPetStatus onCreate={handleSubmitPetStatus} onDelete={handleDeletePetStatus} petStatusData={petStatusSelected} />
          </Modal>

          <ConfirmationModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} onConfirm={confirmDeleteAnimal}/>
          <ConfirmationModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} onConfirm={confirmDeletePetStatus} />

          {/**Cards*/}
          <Card title="Animales" content={animals} isBreed={false} onClickLabelDefault={openEditAnimal} onClickLabelAdd={onClickLabelAddAnimal} />
          <Card title="Estados de mascotas" content={petStatuses} isBreed={false} onClickLabelDefault={openEditPetStatus} onClickLabelAdd={onClickLabelAddPetStatus} />
        </div>
      </div>
    </>
  )
}