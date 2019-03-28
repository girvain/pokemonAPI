/**
 * Materialize framework javascript
 */

$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true
});

//var instance = M.Carousel.getInstance(('.carousel'));

window.setInterval(() => {
  //instance.next();
  $('.carousel').carousel('next');
}, 5000);
