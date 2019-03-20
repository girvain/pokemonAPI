var enterButton = document.getElementById('enter-button');
var treeContainer = document.getElementById('tree-container');

enterButton.addEventListener('click', () => {
  while (treeContainer.firstChild) {
    treeContainer.removeChild(treeContainer.firstChild);
    if (treeContainer.firstChild) {
      treeContainer.removeChild(treeContainer.firstChild);
    }
  }
  var svg = document.getElementsByTagName('svg');
  //svg.className = "col s6 offset-s3";
  console.log(svg);
});
