// Creates an HTML element for a card displaying Pokemon Information
// Each item inputs an index from #1 - #100
function createCardElement(item, index) {
  const cardNumber = index + 1;
  return `
    <li class="card" >
        <img class="pokemoncard" src=${item.image} alt="">
        <div class="card-content">
            <h3 class="header">
              ${item.title}
            </h3>
            <p class="subheader"> 
              ${item.subtitle}
            </p>
            <p class="numbers">
              #${cardNumber}
            </p>
        </div>
    </li>
  `;
}

// Creates HTML elements for a batch of cards.
// It takes an array of data (Pokemon items) as input
function createCardElements(data) {
  return data.map(createCardElement).join("");
}

// Fetches a list of 150 Pokemons from an API
async function fetch150PokemonList() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=150&limit=150"
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
}
console.log(fetch150PokemonList());

// Fetches details of Pokemon from a given URL
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

// Fetches details of from start to end Pokemons (Johto Region)
async function fetch150PokemonDetails(start, end) {
  const detailsList = [];
  const urls = Array.from(
    { length: end - start + 1 },
    (_, i) => `https://pokeapi.co/api/v2/pokemon/${start + i}`
  );
  const response = await Promise.all(
    urls.map((url) => fetchPokemonDetails(url))
  );
  response.forEach((data) => {
    if (data) {
      detailsList.push(data);
    }
  });
  return detailsList;
}

// Enhances the rendering of Pokemon Crds
async function renderOption2Enhanced() {
  const data = await fetch150PokemonDetails(152, 251);
  const batch = data;
  renderCards(batch);
}

renderOption2Enhanced();

// Renders the HTML elements for Pokemon cards (152, 251)
function renderCards(data) {
  const cards = createCardElements(
    data.map((item) => ({
      image: item.sprites.other["official-artwork"].front_default,
      title: item.name,
      subtitle: item.types.map((type) => type.type.name).join(", "),
    }))
  );
  document.getElementById("option-2-enhanced-results").innerHTML = cards;
}

// Loads more Pokemon Details when the user scrolls down
let isLoading = false;
window.addEventListener("scroll", () => {
  if (
    !isLoading &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  ) {
    isLoading = true;
    loadMore();
  }
});

async function loadMore() {
  const data = await fetch150PokemonDetails();
  isLoading = false;
}

// Handles seach bar events by filtering displayed cards based on what the user inputs
function searchbarEventHandler() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
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

// For keyup events on the search bar.
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", searchbarEventHandler);
