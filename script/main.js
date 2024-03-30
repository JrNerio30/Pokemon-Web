function createCardElement(item) {
  return `
      <li class="card">
          <img class="pokemoncard" src=${item.image} alt="">
          <div class="card-content">
              <h3 class="header">
                  ${item.title}
              </h3>
              <p class="subheader">
                  ${item.subtitle}
              </p>
          </div>
      </li>
    `;
}

function createCardElements(data) {
  return data.map(createCardElement).join("");
}

async function fetch150PokemonList() {
  try {

    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=150&limit=150"
    );
    const data = await response.json();
    return data.results;
    //Error handling
  } catch (error) {
    console.log(error);
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
    //Error handling
  } catch (error) {
    console.log(error);
  }
}

// Fetch details for Pokemon from 151(start) to 250(end) Which is the Johto region pretty much
async function fetch150PokemonDetails(start, end) {
  const detailsList = [];
  // the length of the end (250) minus the length of start(150) + 1 (the last legendary of the Johto Region "Ho-Oh")
  // so in the PokeAPI "https://pokeapi.co/api/v2/pokemon?offset=150&limit=150", I'm only grabbing the Johto Pokemon Region.
  const urls = Array.from({ length: end - start + 1}, (_, i) => `https://pokeapi.co/api/v2/pokemon/${start + i}`);
  // using "promise.all()" allows the API call to fetch each details of the Pokemon simultaneously (BATCHING API CALLS)
  // for loops iterates through each of the 150 Pokemon details 1 by 1 which slows it down.
  const response = await Promise.all(urls.map(url => fetchPokemonDetails(url)));
  // Filter out and collect valid data
  response.forEach(data => {
    if (data) {
      detailsList.push(data);
    }
  });
  return detailsList;
}

// Added Lazy Loading Scroll Event for optimizing the overall performance of the website
async function renderOption2Enhanced() {
  const data = await fetch150PokemonDetails(150, 250);
  // Render Initial batch of 20 Pokemon Cards
  // This sets up the lazy loading event
  const batch = data;
  renderCards(batch);
}

renderOption2Enhanced()

// HTML elements for the Pokemon Cards
function renderCards(data){
  const cards = createCardElements(
    data.map((item) => ({
      title: item.name,
      image: item.sprites.other["official-artwork"].front_default,
      subtitle: item.types.map((type) => type.type.name).join(", "),
    }))
  );
  document.getElementById("option-2-enhanced-results").innerHTML = cards;
}

// If the user scrolls to fast >
// To prevent multiple simultanoeous loading request for lazy loading
// This ensures that only one loading request is processed at a time
let isLoading = false;
// Lazy Loading Event > More Cards as the user scrolls
window.addEventListener("scroll", () => {
  // if the user is currently not scrolling and they are near the bottom of the page
  if(!isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    isLoading = true;
    loadMore(); // Load more cards
  }
});

// Function to load more cards
// This ensures a smooth and controlled process of loading additional content as the user scrolls through the page
async function loadMore(){
  const data = await fetch150PokemonDetails();
  isLoading = false;
}


function searchbarEventHandler() {

  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  //Get all the cards
  const enhancedResults = document.getElementById("option-2-enhanced-results");
  const card = enhancedResults.getElementsByClassName("card");

  for (i = 0; i < card.length; i++) {

    if (!card[i].innerHTML.toLowerCase().includes(input)) {
      card[i].style.display = "none";

    } else {
      card[i].style.display = "block";
    }
  }
}

const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", searchbarEventHandler);
