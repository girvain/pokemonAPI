var urlParams = new URLSearchParams(window.location.search);
var api = 'https://pokeapi.co/api/v2/pokemon/';
var pokemonName = urlParams.get('pokemon');
var treeContainer = document.getElementById('tree-container');

fetch(api + pokemonName)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var newPokemon = createPokeJson(myJson);
    // // add the doD3() to the window resize listener so the doD3 can be called
    // // with the latest pokemon object thanks to closures
    window.addEventListener('resize', function() {
      // clear treeContainer, snippet taken from the clearQueryData() in getPokemon.js
      while (treeContainer.firstChild) {
        treeContainer.removeChild(treeContainer.firstChild);
        if (treeContainer.firstChild) {
          treeContainer.removeChild(treeContainer.firstChild);
        }
      }
      doD3(newPokemon, true);
    });

    doD3(newPokemon, true);
  })
  .catch(err => {
    console.log(err);// log the error message from ajax req
  });
