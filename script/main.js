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
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=150"
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

async function fetch150PokemonDetails() {
  const detailsList = [];
  for (let i = 1; i <= 150; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const data = await fetchPokemonDetails(url);
    if (data) {
      detailsList.push(data);
    }
  }

  return detailsList;
}


async function renderOption2Enhanced() {
  const data = await fetch150PokemonDetails();
  const cards = createCardElements(
    data.map((item) => ({
      title: item.name,
      image: item.sprites.other["official-artwork"].front_default,
      subtitle: item.types.map((type) => type.type.name).join(", "),
    }))
  );
  document.getElementById("option-2-enhanced-results").innerHTML = cards;
}

renderOption2Enhanced();


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
