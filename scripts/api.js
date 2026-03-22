//API POUR PHOTOS
async function fetchExercicesAvecPhotos() {
  const BASE_URL = "https://wger.de/api/v2/exerciseinfo/";
  const WGER_ORIGIN = "https://wger.de";

  function toAbsoluteWgerUrl(maybeRelativeUrl) {
    if (!maybeRelativeUrl || typeof maybeRelativeUrl !== "string") {
      return "";
    }
    if (maybeRelativeUrl.startsWith("//")) {
      return `https:${maybeRelativeUrl}`;
    }
    if (maybeRelativeUrl.startsWith("/")) {
      return `${WGER_ORIGIN}${maybeRelativeUrl}`;
    }
    return maybeRelativeUrl;
  }
  
  // On retire language__code=fr de l'URL !
  const equipementParams = [7, 4, 5, 11].map(id => `equipment=${id}`).join("&");
  const urlBase = `${BASE_URL}?format=json&category__in=10,12,9,14,15&${equipementParams}&limit=100`;

  let tous = [];
  let url = urlBase;

  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    tous = tous.concat(data.results);
    url = data.next;
  }

  console.log(`Total brut : ${tous.length} exercices`);

  // Filtre : image présente
  const avecImage = tous.filter(ex => ex.images.length > 0);
  console.log(`Avec image : ${avecImage.length}`);

  // Transformation : on prend le français (12) si dispo, sinon l'anglais (2) en fallback
  const exercices = avecImage.map(ex => {
    const traductionFR = ex.translations.find(t => t.language === 12);
    const traductionEN = ex.translations.find(t => t.language === 2);
    const traduction = traductionFR ?? traductionEN ?? ex.translations[0];

    const imageMain = ex.images.find(img => img.is_main) ?? ex.images[0];

    return {
      id: ex.id,
      uuid: ex.uuid,
      nom: traduction?.name ?? "Sans nom",
      description: traduction?.description ?? "",
      langue: traductionFR ? "fr" : "en",
      categorie: {
        id: ex.category.id,
        nom: ex.category.name,
      },
      muscles: ex.muscles.map(m => m.name),
      musclesSecondaires: ex.muscles_secondary.map(m => m.name),
      equipement: ex.equipment.map(e => e.name),
      images: {
        principale: toAbsoluteWgerUrl(imageMain.image),
        autres: ex.images
          .filter(img => !img.is_main)
          .map(img => toAbsoluteWgerUrl(img.image)),
      },
    };
  });

  console.log(`Exercices finaux : ${exercices.length}`);
  console.log(exercices);
  return exercices;
}