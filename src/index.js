import Notiflix from 'notiflix';
import axios from 'axios';
import SlimSelect from 'slim-select'

new SlimSelect({
  select: '#selectElement'
})

axios.defaults.headers.common['x-api-key'] = 'live_4jZIcbzJb16wtBLxdtx7HF4X002Y6CX5O21zgGXP4uSsQumoilk7xFx7o5e2K7gp';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
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
    errorMessage.textContent = '';
    errorMessage.style.display = 'block';
    if (loader){
    loader.style.display = 'none';
    }
  });

  breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;

    if (loader) {
      loader.classList.add('loading');
      catInfo.style.display = 'none';
    }

    fetchCatByBreed(selectedBreedId).then(catData => {
      catImage.src = catData.url;
      catName.textContent = `Breed: ${catData.breeds ? catData.breeds[0].name : 'N/A'}`;
      catDescription.textContent = `Description: ${catData.breeds ? catData.breeds[0].description : 'N/A'}`;
      catTemperament.textContent = `Temperament: ${catData.breeds ? catData.breeds[0].temperament : 'N/A'}`;
      
      catInfo.style.display = 'block';
      loader.classList.remove('loading');
   }).catch(error => {
      errorMessage.textContent = '';
      errorMessage.style.display = 'block';

      if (loader) {
        loader.classList.remove('loading');
      }

   });
  });
});