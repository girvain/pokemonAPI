var enterButton = document.getElementById('enter-button');
var userInput = document.getElementById('pokemon-input');
var display = document.getElementById('pokemon-display');
var treeContainer = document.getElementById('tree-container');
var api = 'https://pokeapi.co/api/v2/pokemon/';

enterButton.addEventListener('click', () => {
    fetch(api + userInput.value)
    .then(function(response) {
      //console.log(response);
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);

      // clear containers, tree-container and pokemon-display div's
      while (display.firstChild) {
        display.removeChild(display.firstChild);
        treeContainer.removeChild(treeContainer.firstChild);
      }
      // Create an img and add the image from the API response to it
      let pokemonImg = document.createElement('IMG');
      pokemonImg.setAttribute('src', myJson.sprites.front_default);
      display.append(pokemonImg);

      var newPokemon = createPokeJson(myJson);

      doD3(newPokemon);
    });
  console.log('enter Button triggered');
});

function createPokeJson(pokemonObj) {
  // create the initial object container
  var newPokemonObj = {};
  newPokemonObj.name = pokemonObj.name;
  newPokemonObj.children = [];

  newPokemonObj.children.push(
  getPokemonAttribute(pokemonObj.abilities, 'abilities'));
  newPokemonObj.children.push(
    getPokemonProperty(pokemonObj.base_experience, 'base_experience')
  );
  newPokemonObj.children.push(getPokemonProperty(pokemonObj.height, 'height'));
  newPokemonObj.children.push(getPokemonProperty(pokemonObj.id, 'id'));
  newPokemonObj.children.push(getPokemonMoves(pokemonObj.moves));
  newPokemonObj.children.push(
    getPokemonAttribute(pokemonObj.game_indices, 'game indices'));
  newPokemonObj.children.push(getPokemonStats(pokemonObj.stats, 'stats'));
  newPokemonObj.children.push(getPokemonAttribute(pokemonObj.types, 'type'));
  return newPokemonObj;
}

function getPokemonProperty(pokemonObjProp, name) {
  var attributeObj = {
    name: name,
    children: [],
  };
  attributeObj.children.push({name: pokemonObjProp.toString()});
  //console.log(pokemonObjProp);
  return attributeObj;
}

function getPokemonAttribute(attribute, name) {
  var attributeObj = {
    name: name,
    children: [],
  };

  for (let i = 0; i < attribute.length; i++) {
    var innerArray = Object.values(attribute[i]);

    for (var j = 0; j < innerArray.length; j++) {
      if (typeof innerArray[j] === 'object') {
        if (typeof innerArray[j].name === 'string') {
          //console.log(innerArray[j].name);
          attributeObj.children.push({
            name: innerArray[j].name,
            children: [],
          });
        }
      }
    }// end of inner for
  }// end of outer for

  return attributeObj;
}

function getPokemonStats(attribute, name) {
  // statnode contains an attribute object with a child array of stat names
  var statnode = getPokemonAttribute(attribute, name);
  // loop through the statnode's children array and add
  for (let i = 0; i < statnode.children.length; i++) {
    // get the base_stat and effort property from the stats array and
    // passes in as attribute
    var base_stat = attribute[i].base_stat;
    var effort = attribute[i].effort;

    statnode.children[i].children.push({name: 'base stat ' + base_stat});
    statnode.children[i].children.push({name: 'effort ' + effort});
  }// end of for
  return statnode;
}

class attributeObj1 {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
}

function nodeShrinker(attributeObj) {
  var newAttributeObj = new attributeObj1(attributeObj.name, []);
  let total = attributeObj.children.length;
  let subGroup = 0;
  if (total % 4 === 0) {
    subGroup = total / 4;
  } else {
    subGroup = (total - (total % 4)) / 4;
  }
  // function to create an object and fill it with the subset of
  // the moves, takes a name for the object
  function fillMoveObject(start, end, name) {
    var moveObject = new attributeObj1(name, []);
    for (var i = start; i < end; i++) {
      moveObject.children.push(attributeObj.children[i]);
    }
    return moveObject;
  }
  var set1 = fillMoveObject(0, subGroup, 'set1');
  var set2 = fillMoveObject(subGroup, subGroup * 2, 'set2');
  var set3 = fillMoveObject(subGroup * 2, subGroup * 3, 'set3');
  var set4 = fillMoveObject(subGroup * 3, total, 'set4');

  newAttributeObj.children.push(set1);
  newAttributeObj.children.push(set2);
  newAttributeObj.children.push(set3);
  newAttributeObj.children.push(set4);

  return newAttributeObj;
}

function getPokemonMoves(attribute) {
  var movesObj = getPokemonAttribute(attribute, 'moves');
  var newMovesObj = nodeShrinker(movesObj);
  return newMovesObj;
}

