

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatNumber = (value: number) => {
  return value.toLocaleString('es-PY');
}

export const convertGenderToSpanish = (str: string) => {
  return str === "MALE" ? "Macho" : str === "FEMALE" ? "Hembra" : str;
}

export const getGenderIcon = (str: string) => {
  return str === "MALE" ? "male" : str === "FEMALE" ? "female" : str;
}

export const getVaccinatedIcon = (vaccined: boolean) => {
  return vaccined ? "vaccinated" : "";
}

export const getSterilizedIcon = (vaccined: boolean) => {
  return vaccined ? "sterilized" : "";
}

export const getAnimalIcon = (str: string) => {
  return str === "perro" ? "dog" : str === "Perros" ? "dog" : str === "gato" ? "cat" : str === "Gatos" ? "cat" : str === "tortuga" ? "turtle" : str === "conejo" ? "rabbit" : "generic";
}

export const getConditionIcon = (str: string) => {
  return str === "USADO" ? "old" : str === "NUEVO" ? "new" : str;
}

export const getColorAdoptionOrMissing = (str: string) => {
  return str === "En Adopción" ? "Adopcion" : str === "Perdido" ? "Extraviados" : "Extraviados";
}