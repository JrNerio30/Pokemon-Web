function createCardElement(item){
  return `
    <li class="card">
      <img src=${item.image} alt="">
        <div class="card-contaner">
          <p class="subheader">
            ${item.subtitle}
          </p>
          <h3 class="header">
            ${item.title}
          </h3>
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
 } catch(error){
  console.log(error);
 }
}

async function fetchPokemonDetails(url){
  try{
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch(error){
    console.log(error);
  }
}


async function fetch150PokemonDetails() {
  const detailslist = [];
  for(let i = 1; i <= 150; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`; 
    const data = await fetchPokemonDetails(url);
    if (data) {
      detailslist.push(data);
    }
  }

  return detailslist;
}