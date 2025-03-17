"use client"

import { Card } from "@/components/ui/card";
import ClickableTag from "@/components/admin-card/clickable-tag";
import { Animal } from "@/types/animal";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import { useAuth } from "@/contexts/authContext";
import { getAnimals, createAnimal, deleteAnimal, updateAnimal} from "@/utils/animals.http";
import { getPetStatuses, createPetStatus, updatePetStatus, deletePetStatus} from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";
import FormAnimals from "./form-animal";
import FormPetStatus from "./form-pet-status";


export default function page() {
  /*Logica para manejar lo de animales y razas */
  const [modalAnimal, setModalAnimal] = useState(false);
  const [modalPetStatus, setModalPetStatus] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [petStatuses, setPetStatuses] = useState<PetStatus[]>([]);
  //entidades seleccionadas
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

  const handleDeleteAnimal = async () => {
    if (animalSelected.id === 0) {
      setModalAnimal(false);
      return;
    }

    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este animal?");
    if (!confirmDelete) return;

    try {
      if (!authToken) return;
      //eliminar animal
      await deleteAnimal(authToken, animalSelected.id);
      //actualizar lista de animales
      setAnimals(animals.filter((animal) => animal.id !== animalSelected.id));
      setModalAnimal(false);
    } catch (error) {
      console.error('Error al eliminar animal:', error);
    }
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

  const handleDeletePetStatus = async () => {
    if(!authToken) return;
    if (petStatusSelected.id === 0) {
      setModalPetStatus(false);
      return;
    }

    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este estado?");
    if (!confirmDelete) return;
    try{
      await deletePetStatus(authToken, petStatusSelected.id);
      setPetStatuses(petStatuses.filter((petStatus) => petStatus.id !== petStatusSelected.id));
      setModalPetStatus(false);
    }catch(error){
      console.error('Error al eliminar estado:', error);
    }
  }
  return (
    <>
      <div className="rounded-lg border border-gray-900 p-6">

        <div className="flex justify-center">
          <Modal isOpen={modalAnimal} onClose={() => setModalAnimal(false)} title={animalSelected.id === 0 ? "Crear animal" : "Editar animal"}>
            <FormAnimals onCreate={handleSubmitAnimal} onDelete={handleDeleteAnimal} animalData={animalSelected} />
          </Modal>

          <Modal isOpen={modalPetStatus} onClose={() => setModalPetStatus(false)} title={petStatusSelected.id === 0 ? "Crear estado" : "Editar estado"}>
            <FormPetStatus onCreate={handleSubmitPetStatus} onDelete={handleDeletePetStatus} petStatusData={petStatusSelected} />
          </Modal>
          <Card>
            <>
              <h4>Animales</h4>
              <div className="flex flex-wrap max-h-full max-w-72 overflow-hidden gap-1 mt-2">
                {animals.map((animal) => (
                  <ClickableTag key={animal.id} label={animal.name} onClick={() => openEditAnimal(animal)}></ClickableTag>
                ))}
                <ClickableTag type="add" onClick={() => { setAnimalSelected({ id: 0, name: "" }); setModalAnimal(true)}}></ClickableTag>
              </div>
            </>
          </Card>

          <Card>
            <>
              <h4>Estados de mascotas</h4>
              <div className="flex flex-wrap max-h-full max-w-72 overflow-hidden gap-1 mt-2">
                {petStatuses.map((element) => (
                  <ClickableTag key={element.id} label={element.name} onClick={() => openEditPetStatus(element)}></ClickableTag>
                ))}
                <ClickableTag type="add" onClick={() => { setPetStatusSelected({ id: 0, name: "", description: "" }); setModalPetStatus(true)}}></ClickableTag>
              </div>
            </>
          </Card>
        </div>
      </div>


    </>
  )
}