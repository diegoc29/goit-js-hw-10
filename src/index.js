import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = 'live_4jZIcbzJb16wtBLxdtx7HF4X002Y6CX5O21zgGXP4uSsQumoilk7xFx7o5e2K7gp';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/image/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => Promise.reject(error));
}

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.getElementById('breed-select');
  const loader = document.getElementById('loader');
  const catInfo = document.getElementById('cat-info');
  const catImage = document.getElementById('cat-image');
  const catName = document.getElementById('cat-name');
  const catDescription = document.getElementById('cat-description');
  const catTemperament = document.getElementById('cat-temperament');
  const errorMessage = document.getElementById('error-message');

  fetchBreeds().then(breeds => {
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    breedSelect.style.display = 'block';
    loader.style.display = 'none';
  }).catch(error => {
    errorMessage.textContent = 'Error fetching breeds. Please try again.';
    errorMessage.style.display = 'block';
    loader.style.display = 'none';
  });

  breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;

    loader.style.display = 'block';
    catInfo.style.display = 'none';

    fetchCatByBreed(selectedBreedId).then(catData => {
      catImage.src = catData.url;
      catName.textContent = `Breed: ${catData.breeds[0].name}`;
      catDescription.textContent = `Description: ${catData.breeds[0].description}`;
      catTemperament.textContent = `Temperament: ${catData.breeds[0].temperament}`;

      catInfo.style.display = 'block';
      loader.style.display = 'none';
    }).catch(error => {
      errorMessage.textContent = 'Error fetching cat information. Please try again.';
      errorMessage.style.display = 'block';
      loader.style.display = 'none';
    });
  });
});