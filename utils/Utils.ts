

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
  return str === "perro" ? "dog" : str === "Perros" ? "dog" : str === "gato" ? "cat" : str === "Gatos" ? "cat" : str === "tortuga" ? "turtle" : str === "conejo" ? "rabbit" : str === "ave" ? "bird" : "generic";
}

export const getConditionIcon = (str: string) => {
  return str === "USADO" ? "old" : str === "NUEVO" ? "new" : str;
}

export const getPublicationTypeColor = (str: string) => {
  return str === "En Adopción" ? "Adoption"
    : str === "Perdido" ? "Missing"
      : str === "Encontrado" ? "Found"
        : str == "En Casa" ? "MyPet"
          : str == "Voluntariado" ? "Volunteering"
            : str == "Blog" ? "Blog"
              : "Marketplace";
}

export const getColorGender = (str: string): string => {
  return str === "MALE" ? "Female" : "Male";
}

export const getAge = (birthdate: string): string => {
  // Parse the ISO 8601 date string
  const birth = new Date(birthdate);
  
  // Validate date
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birthdate format');
  }

  const today = new Date();

  // Extract components using Date methods
  const birthYear = birth.getUTCFullYear();
  const birthMonth = birth.getUTCMonth() + 1; // Months are 0-based
  const birthDay = birth.getUTCDate();

  const currentYear = today.getUTCFullYear();
  const currentMonth = today.getUTCMonth() + 1;
  const currentDay = today.getUTCDate();

  const yearDiff = currentYear - birthYear;

  // Check if the pet is less than 1 year old (before first birthday)
  if (yearDiff === 0 || (yearDiff === 1 && (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)))) {
    // Calculate total months
    let totalMonths = (yearDiff * 12) + currentMonth - birthMonth;
    
    // Adjust if current day is before birth day
    if (currentDay < birthDay) {
      totalMonths--;
    }

    if (totalMonths <= 0) {
      return "Peque";
    }

    return `${totalMonths} ${totalMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    // Calculate years with month/day adjustment
    let age = yearDiff;

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }

    // Ensure non-negative age
    age = Math.max(0, age);

    return `${age} ${age === 1 ? 'año' : 'años'}`;
  }
};