import $ from 'jquery';

var enterButton = document.getElementById('enter-button');
var api = 'https://pokeapi.co/api/v2/pokemon/charmander';

enterButton.addEventListener('click', (pokemon) => {
  $.get(api,
    { },
    function (data, textStatus, jqXHR) {
      // success callback
    }
  );
  console.log('enter Button triggered');
});
