
//List of restaurants and their information
var list = [
  {names:"McDonald's", crime: "High", cuisine:"Fast Food", range:"1", image:"images/swiping_temp/Mcdonalds.jpg"},
  {names:"Pattaya", crime: "Low", cuisine:"Thai", range:"2", image:"images/swiping_temp/Pattaya.jpg"},
  {names:"Farmacy", crime: "Medium", cuisine:"Breakfast", range:"2", image:"images/swiping_temp/Farmacy.jpg"},
  {names:"Buddakan", crime: "High", cuisine:"Chinese", range:"3", image:"images/swiping_temp/Buddakan.jpg"}
];

//Insert HTML for the restaurants
var a;
for (a = 0; a < list.length; a++) {
  // console.log("HI");
  document.getElementById('image_slider').innerHTML = document.getElementById('image_slider').innerHTML + '<div class="item"><img id="image_' + a + '" src="' + list[a].image + '" /></div>';
  document.getElementById('text_slider').innerHTML = document.getElementById('text_slider').innerHTML + '<div class="item" id="' + a + '"><span id="names_' + a + '">' + list[a].names + 
  '</span><span>Crime:<text id="crime_' + a + '">' + list[a].crime + '</text></span><span id="cuisine_' + a + '">' + list[a].cuisine + '</span><span id="range_' + a + '">' + list[a].range + '</span></div>';
}

//Hide the Yes and Eww Text
$(".yes").hide();
$(".no").hide();


//Create functionality for the slider.
$(document).ready(function(){
  $('#slick').slick({
    draggable: false
  });
});

var $slider = $('.slideshow .slider'),
maxItems = $('.item', $slider).length,
dragging = false,
tracking,
rightTracking;

$sliderRight = $('.slideshow').clone().addClass('slideshow-right').appendTo($('.split-slideshow'));

rightItems = $('.item', $sliderRight).toArray();
reverseItems = rightItems.reverse();
$('.slider', $sliderRight).html('');
for (i = 0; i < maxItems; i++) {
  $(reverseItems[i]).appendTo($('.slider', $sliderRight));
}

$slider.addClass('slideshow-left');
$('.slideshow-left').slick({
  vertical: true,
  verticalSwiping: false,
  arrows: false,
  infinite: true,
  dots: true,
  speed: 650,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
}).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
  if (currentSlide > nextSlide && nextSlide == 0 && currentSlide == maxItems - 1) {
    $('.slideshow-right .slider').slick('slickGoTo', -1);
    $('.slideshow-text').slick('slickGoTo', maxItems);
  } else if (currentSlide < nextSlide && currentSlide == 0 && nextSlide == maxItems - 1) {
    $('.slideshow-right .slider').slick('slickGoTo', maxItems);
    $('.slideshow-text').slick('slickGoTo', -1);
  } else {
    $('.slideshow-right .slider').slick('slickGoTo', maxItems - 1 - nextSlide);
    $('.slideshow-text').slick('slickGoTo', nextSlide);
  }
})

//Create functionality for user input, especially displaying "Yes" and "Eww" text
.on('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode == 38 || event.keyCode == 40) {
    $(this).slick('slickNext');
    $(".yes").hide();
    $(".no").hide();
  }
}).on('keydown', function(event) {
  event.preventDefault();
  if (event.keyCode == 38) {
    $(".yes").show();
  } else if (event.keyCode == 40) {
    $(".no").show();
  }
});

//Edit slider settings
$('.slideshow-right .slider').slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 650,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
  initialSlide: maxItems - 1
});
$('.slideshow-text').slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 650,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
});
