var enterButton = document.getElementById('enter-button');
var treeContainer = document.getElementById('tree-container');
// var input = document.getElementById('pokemon-input');

enterButton.addEventListener('click', () => {
  // clear the tree-container of the previous D3
  while (treeContainer.firstChild) {
    treeContainer.removeChild(treeContainer.firstChild);
    if (treeContainer.firstChild) {
      treeContainer.removeChild(treeContainer.firstChild);
    }
  }

  //window.scrollTo(0, 20000);

  //firstNode.scrollIntoView();
  var firstNode = document.getElementById('tree-container');
  firstNode.scrollIntoView();

  // code to add a prompt after user has input a pokemon
  /*let container = enterButton.parentElement;*/
  //if (container.childElementCount < 3) {
    //let h4 = document.createElement('h4');
    //h4.innerText = "Enter Another Pokemon?"
    //container.prepend(h4);
  //}

});

// $(document).ready(function(){
//   $('.carousel').carousel();
// });



$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true
});

//var instance = M.Carousel.getInstance(('.carousel'));

window.setInterval(() => {
  //instance.next();
  $('.carousel').carousel('next');
}, 5000);
