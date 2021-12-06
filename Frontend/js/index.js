const formSearch = document.getElementById("form-search");
const inputSearch = document.getElementById("input-search");

inputSearch.value = "hola AND casa OR uady mate NOT pluma";
const operators = ["or", "and", "not"];
let globalQuery = "";

formSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = inputSearch.value;
  let elements = value.split(" ");
  if (elements[0] && !operators.includes(elements[0])) {
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
    console.log(query.join(" "));
  });
});

const requestPages = (query) => {};

const createQuery = (words, op) => {
  const query = words.map((w) => `${op}${w.word}`);
  console.log(query.join(" "));
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
