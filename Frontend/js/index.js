const formSearch = document.getElementById("form-search");
const inputSearch = document.getElementById("input-search");
const results = document.getElementById("results");
const pages = document.getElementById("pages");
const checkbox =  document.getElementById("faceted");
const index = document.getElementById("form-index");
const urls = document.getElementById("urls");
const facetada = document.getElementById("facetada");
const recommendation = document.getElementById("recommendation");

const base_url = "http://localhost:3000/Backend/index.php?";

inputSearch.value = "";
const operators = ["or", "and", "not"];
let faceted = false
checkbox.checked = faceted;

checkbox.addEventListener("click", ()=>{
  checkbox.checked = !faceted;
  faceted = !faceted;
})

index.addEventListener("submit", (event)=>{
  event.preventDefault();
  const values = urls.value.split("\n");
  const promises = values.map(async value=>{
    return await indexUrl(value);
  })

  Promise.all(promises).then((query) => {
    console.log(query)
  });
})

const indexUrl = async (url) => {
  const enpoint = `${base_url}crawler=${url}`;
  try {
    const result = await fetch(enpoint);
    return await result.json();
  } catch (error) {
    console.error(error);
    return {}
  }
}

formSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = inputSearch.value;

  if(faceted){
    return searchDocuments(value);
  }

  let elements = value.split(" ");
  if (elements[0] && !operators.includes(elements[0])) {
    getRecommendation(elements[0]);
    elements[0] = `+${elements[0]}`;
    value = elements.join(" ");
  }

  value = value.replace(" AND ", " +");
  value = value.replace(" OR ", " ");
  value = value.replace(" NOT ", " -");
  value = value.split(" ");
  const query = value.map(async (v) => {
    const letters = v.split("");
    const words = await extendWord(v);
    if (letters[0] == "+") {
      return createQuery(words, "+");
    }

    if (letters[0] == "-") {
      return createQuery(words, "-");
    }

    return createQuery(words, "");
  });

  Promise.all(query).then((query) => {
    searchDocuments(query.join(" "));
  });
});

const getRecommendation = (word)=>{
  const url = `${base_url}grammar=${word}"}`;
  fetch(url).then(res=>res.json())
    .then(response=>{
      const words = response.map(res=>`<strong>${res.word}</strong>`)
      recommendation.innerHTML = `Querías decir: ${words.join(", ")} `
    }).catch(error=>console.error(error));
    return;
}

const searchDocuments = async (query) => {
  try {
    const url = `${base_url}search=${query}${faceted && "&&facet=true"}`;
    const result = await fetch(url);
    const response = await result.json();
    renderDocuments(response);
  } catch (error) {
    console.error(error);
  }
};

const renderDocuments = (data) => {
  results.innerHTML = `Resultados encontrados ${data.response.numFound}`;
  console.log(data);

  let html = "";

  if(faceted ){
    dataFacet = data.facet_counts.facet_fields.description
    console.log(dataFacet)
    // const facetObjets = Object.keys(dataFacet)
    // console.log(facetObjets)
    html += `<div class="facet-container">
                <div class="facet">
                  <p>URL de la página</p>
                  <p>Veces repetidas</p>
                </div>`
    for(i=0; i<dataFacet.length; i+=2){
      if(dataFacet[i+1] > 0){
        html += `<div class="facet">
                      <p>${dataFacet[i]}</p>
                      <p>${dataFacet[i+1]}</p>
                  </div>`
      }
    }
    html += "</div>"
    facetada.innerHTML = html;
    // .map(key=>{
    //   html += `<div class=''>${key}</div>`
    // ${key}:${dataFacet[key]}`
    // })
  }

  html = "";

  html += `<div class='item hd'>
                <p class="id hd">Enlace</p>
                <p class="title hd">Titulo</p>
                <p class="desc hd">Descripción</p>
                <p class="score hd">Score</p>
              </div>`;

  data.response.docs.map(doc=>{
    html += "<div class='item'>"
    html += `   <a class="id" href=${doc.id}>Enlace</a>`
    html += `   <p class="title">${doc.title}</´p>`
    html += `   <p class="desc">${data?.highlighting[doc.id]?.description[0] || doc.description}</p>`
    html += `   <p class="score">${doc.score.toFixed(4)}</p>`
    html += "</div>"
  });

  pages.innerHTML = html;  
}

const createQuery = (words, op) => {
  const query = words.map((w) => `${op}${w.word}`);
  return query.join(" ");
};

const extendWord = async (word) => {
  try {
    const url = `https://api.datamuse.com/words?ml=${word}&&v=es&&max=3`;
    const result = await fetch(url);
    return await result.json();
  } catch (error) {
    return [word];
  }
};
