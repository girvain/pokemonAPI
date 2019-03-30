var enterButton = document.getElementById('enter-button');
var userInput = document.getElementById('pokemon-input');
var treeContainer = document.getElementById('tree-container');
var api = 'https://pokeapi.co/api/v2/pokemon/';
var fullscreenBtn = document.getElementById('fullscreen-btn');

/*
 * Data Container creating pokemon attribute nodes to interact
 * with the d3
 */
class DataContainer {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
}

/*
 * Listener for the enter button for the pokemon search. Uses
 * fetch to query the pokemon API to get the corrisponding JSON
 * data. Contains calls to the error functions below on success
 * and failures of the ajax call.
 */
enterButton.addEventListener('click', () => {
  fetch(api + userInput.value.toLocaleLowerCase())
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var newPokemon = createPokeJson(myJson);
      var pokemonName = userInput.value.toLocaleLowerCase();

      // add the doD3() to the window resize listener so the doD3 can be called
      // with the latest pokemon object thanks to closures
      window.addEventListener('resize', function() {
        clearQueryData();
        doD3(newPokemon);
      });

      // listener fuction to launch the pokemonFullScreen.html page with the
      // user's latest pokemon name query as a string query
      fullscreenBtn.addEventListener('click', () => {
        window.open("../pokemonFullScreen.html?pokemon=" + pokemonName);
      });

      clearQueryData();
      doD3(newPokemon);
      // show the fullscreen button now that it all works
      fullscreenBtn.style.display = 'inline-block';
    })
    .catch(err => {
      console.log(err);// log the error message from ajax req
      clearError(userInput.parentElement);
      createErrorMsg(userInput.parentElement);
    });
});

/*
 * Function to clear the tree-container div of the previous d3 visualisation
 * and to clear the text in the input field.
 */
function clearQueryData() {
  // clear the tree-container of the previous D3
  while (treeContainer.firstChild) {
    treeContainer.removeChild(treeContainer.firstChild);
    if (treeContainer.firstChild) {
      treeContainer.removeChild(treeContainer.firstChild);
    }
  }
  // clear input box, remove error
  userInput.value = '';
  clearError(userInput.parentElement);
}




/*
 * Function to create a <p> element that contains an error message to inform the user
 * That the pokemon name they input was not found. takes a parent element as an argument,
 * creates an element, adds a color attribute and id to it, appends it to parent element
 * then clears the text box for the next input.
 */
function createErrorMsg(parent) {
  // const parent = userInput.parentElement;
  const errMsg = document.createElement('p');
  errMsg.innerHTML = 'Pokemon not Found!!!';
  errMsg.style.color = 'red';
  errMsg.id = 'error-message';
  parent.appendChild(errMsg);
  // clear input box and remove error mesg
  userInput.value = '';

}

/*
 * Function to remove the error message element from the DOM. Takes a parent element
 * as an argument.
 * @param
 */
function clearError(parent) {
  var errorElemt = document.getElementById('error-message');
  if (errorElemt) {
    parent.removeChild(errorElemt);
  }
}

/*
 * Function to create the main parent DataContainer to store all the nodes of the D3. It
 * takes the JSON object response from the fetch query, creates a new DataContainer, then
 * adds the following objects to the children array of the dataContainer using the 
 * getPokemonAttribute(), getPokemonStats, and getPokemonProp functions. Then returns the
 * fully filled dataContainer to be passed to the doD3() function in the dndTree.js file.
 */
function createPokeJson(pokemonObj) {
  // create the initial object container
  var newPokemonObj = new DataContainer(pokemonObj.name, []);

  // add abilities
  newPokemonObj.children.push(
    getPokemonAttribute(pokemonObj.abilities, 'abilities'));
  // add base_experience
  newPokemonObj.children.push(
    getPokemonProperty(pokemonObj.base_experience, 'base_experience'));
  // add height
  newPokemonObj.children.push(getPokemonProperty(pokemonObj.height, 'height'));
  // add id
  newPokemonObj.children.push(getPokemonProperty(pokemonObj.id, 'id'));
  // add moves, the getPokemonAttribute() returns too many dataContainers so it's wrapped 
  // with the  nodeShrinker wrapper
  newPokemonObj.children.push(nodeShrinker(getPokemonAttribute(pokemonObj.moves, 'moves')));
  // add game indices
  newPokemonObj.children.push(
    getPokemonAttribute(pokemonObj.game_indices, 'game indices'));
  // add stats
  newPokemonObj.children.push(getPokemonStats(pokemonObj.stats, 'stats'));
  // add type
  newPokemonObj.children.push(getPokemonAttribute(pokemonObj.types, 'type'));
  return newPokemonObj;
}

/*
 * Function to take a pokemon object property that contains a raw datatype,
 * usually an integer, and place it in a DataContainer object and return it.
 * The name param will be the name of the DataContainer
 */
function getPokemonProperty(pokemonObjProp, name) {
  var dataContainer = new DataContainer(name, []);
  dataContainer.children.push({
    name: pokemonObjProp.toString()
  });
  return dataContainer;
}

/*
 * Function takes an array of objects labed attributeObjArray that is taken 
 * from the JSON repsonse pokemon object. It then loops through
 * each object to check firstly if it has a futher nested object. If so it 
 * then checks if it has a property called name and if it contains a string.
 * If so the value is extracted and placed in a new DataContainer which is
 * then added to the children array of the parent DataContainer that will 
 * be returned at completion. Name param is the name of the data container.
 */
function getPokemonAttribute(attributeObjArray, name) {
  //Parent data container
  var dataContainer = new DataContainer(name, []);

  for (let i = 0; i < attributeObjArray.length; i++) {
    var innerArray = Object.values(attributeObjArray[i]);
    for (var j = 0; j < innerArray.length; j++) {
      if (typeof innerArray[j] === 'object') {
        if (typeof innerArray[j].name === 'string') {
          dataContainer.children.push(new DataContainer(innerArray[j].name, []));
        }
      }
    } // end of inner for
  } // end of outer for
  return dataContainer;
}

/*
 * Function that is a specialist for creating a container for the pokemon object's
 * stats. MUST be passed the stats array from the pokemon JSON object. The function
 * calls the getPokemonAttribute() and uses the returned DataContainer to add the 
 * additional values to. It then loops through the attributeObjArray again
 * (because the getPokemonAttribute() already done this) and looks up the additional
 * properties to be added, puts them in their own dataContainer, then adds them to the
 * children array of the parent dataContainer that is to be returned by the function.
 */
function getPokemonStats(attributeObjArray, name) {
  // parent data container
  var dataContainer = getPokemonAttribute(attributeObjArray, name);
  // loop through the dataContainer's children array 
  for (let i = 0; i < dataContainer.children.length; i++) {
    // get ref to the base_stat and effort property from the attributeObjArray
    var base_stat = attributeObjArray[i].base_stat;
    var effort = attributeObjArray[i].effort;
    // pass the base_stat and effort values to the corrisponding objects in container
    dataContainer.children[i].children.push(new DataContainer('base stat ' + base_stat, []));
    dataContainer.children[i].children.push(new DataContainer('effort ' + effort, []));
  } // end of for
  return dataContainer;
}

/*
 * Function to take a DataContainer object and split it into 4 DataContainer
 * objects, then place them inside a new DataContainer object and return it.
 * MUST be passed a DataContainer that has >= 4 child objects.
 */
function nodeShrinker(dataContainer) {
  var newDataContainer = new DataContainer(dataContainer.name, []);
  let total = dataContainer.children.length;
  let subGroup = 0;
  if (total % 4 === 0) {
    subGroup = total / 4;
  } else {
    subGroup = (total - (total % 4)) / 4;
  }
  // function to create an object and fill it with the subset of
  // the moves, takes a name for the object
  function fillMoveObject(start, end, name) {
    var moveObject = new DataContainer(name, []);
    for (var i = start; i < end; i++) {
      moveObject.children.push(dataContainer.children[i]);
    }
    return moveObject;
  }
  var set1 = fillMoveObject(0, subGroup, 'set1');
  var set2 = fillMoveObject(subGroup, subGroup * 2, 'set2');
  var set3 = fillMoveObject(subGroup * 2, subGroup * 3, 'set3');
  var set4 = fillMoveObject(subGroup * 3, total, 'set4');

  newDataContainer.children.push(set1);
  newDataContainer.children.push(set2);
  newDataContainer.children.push(set3);
  newDataContainer.children.push(set4);

  return newDataContainer;
}
