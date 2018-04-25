// var app = angular.module('selector',[]);
//
// app.controller('images', function($scope, $http, $window) {
//   $scope.imageList = [
//     {name:"McDonald's", imagePath:"images/swiping_temp/Mcdonalds.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Pattaya.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Farmacy.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Buddakan.jpg"}
//   ];
// });
//
// app.controller('text', function($scope, $http, $window) {
//   $scope.imageList = [
//     {name:"McDonald's", imagePath:"images/swiping_temp/Mcdonalds.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Pattaya.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Farmacy.jpg"},
//     {name:"McDonald's", imagePath:"images/swiping_temp/Buddakan.jpg"}
//   ];
// });

//This will populate everything

var list = [
  {names:"McDonald's", crime: "High", cuisine:"Fast Food", range:"1", image:"images/swiping_temp/Mcdonalds.jpg"},
  {names:"Pattaya", crime: "Low", cuisine:"Thai", range:"2", image:"images/swiping_temp/Pattaya.jpg"},
  {names:"Farmacy", crime: "Medium", cuisine:"Breakfast", range:"2", image:"images/swiping_temp/Farmacy.jpg"},
  {names:"Buddakan", crime: "High", cuisine:"Chinese", range:"3", image:"images/swiping_temp/Buddakan.jpg"}
];

var count = 0;

//Insert the HTML foundation necessary
//Insert HTML for the images
var a;
for (a = 0; a < list.length; a++) {
  // console.log("HI");
  document.getElementById('image_slider').innerHTML = document.getElementById('image_slider').innerHTML + '<div class="item"><img id="image_' + a + '" src="' + list[a].image + '" /></div>';
  document.getElementById('text_slider').innerHTML = document.getElementById('text_slider').innerHTML + '<div class="item" id="' + a + '"><span id="names_' + a + '">' + list[a].names + 
  '</span><span>Crime:<text id="crime_' + a + '">' + list[a].crime + '</text></span><span id="cuisine_' + a + '">' + list[a].cuisine + '</span><span id="range_' + a + '">' + list[a].range + '</span></div>';
}

//Insert HTML for the text





// var changeSlide = function(slideNum) {
//   // $('#name_'+slideNum).text(list[count].name);
//   // console.log(  $('#name_'+slideNum).text())
//   $('#names_'+slideNum).text(list[count].names);
//   $('#crime_'+slideNum).text(list[count].crime);
//   $('#cuisine_'+slideNum).text(list[count].cuisine);
//   $('#range_'+slideNum).text(list[count].range);
//   $('#image_'+slideNum).attr('src', list[count].image);
//   count++;
//   // if (count == list.length) {
//   //   count = 0;
//   // }
// }

// var i;
// for (i = 0; i < list.length; i++) { 
//     changeSlide(i);
// }

$(".yes").hide();
$(".no").hide();

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
  speed: 850,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
}).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
  if (currentSlide > nextSlide && nextSlide == 0 && currentSlide == maxItems - 1) {
    // changeSlide(currentSlide);
    $('.slideshow-right .slider').slick('slickGoTo', -1);
    $('.slideshow-text').slick('slickGoTo', maxItems);
  } else if (currentSlide < nextSlide && currentSlide == 0 && nextSlide == maxItems - 1) {
    // changeSlide(currentSlide);
    $('.slideshow-right .slider').slick('slickGoTo', maxItems);
    $('.slideshow-text').slick('slickGoTo', -1);
  } else {
    // changeSlide(currentSlide);
    $('.slideshow-right .slider').slick('slickGoTo', maxItems - 1 - nextSlide);
    $('.slideshow-text').slick('slickGoTo', nextSlide);
  }
})

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

// .on("mousewheel", function(event) {
//   event.preventDefault();
//   if (event.deltaX > 0 || event.deltaY < 0) {
//     $(this).slick('slickNext');
//   } else if (event.deltaX < 0 || event.deltaY > 0) {
//     $(this).slick('slickPrev');
//   };
// });



// .on('mousedown touchstart', function(){
//   dragging = true;
//   tracking = $('.slick-track', $slider).css('transform');
//   tracking = parseInt(tracking.split(',')[5]);
//   rightTracking = $('.slideshow-right .slick-track').css('transform');
//   rightTracking = parseInt(rightTracking.split(',')[5]);
// }).on('mousemove touchmove', function(){
//   if (dragging) {
//     newTracking = $('.slideshow-left .slick-track').css('transform');
//     newTracking = parseInt(newTracking.split(',')[5]);
//     diffTracking = newTracking - tracking;
//     $('.slideshow-right .slick-track').css({'transform': 'matrix(1, 0, 0, 1, 0, ' + (rightTracking - diffTracking) + ')'});
//   }
// }).on('mouseleave touchend mouseup', function(){
//   dragging = false;
// });

$('.slideshow-right .slider').slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 800,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
  initialSlide: maxItems - 1
});
$('.slideshow-text').slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 750,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
});

// var list = [
//   {name:"McDonald's", crime: "High", cuisine:"Fast Food", range:"1", image:"images/swiping_temp/Mcdonalds.jpg"},
//   {name:"Pattaya", crime: "Low", cuisine:"Thai", range:"1", image:"images/swiping_temp/Pattaya.jpg"},
//   {name:"Farmacy", crime: "Medium", cuisine:"Breakfast", range:"2", image:"images/swiping_temp/Farmacy.jpg"},
//   {name:"Buddakan", crime: "High", cuisine:"Chinese", range:"3", image:"images/swiping_temp/Buddakan.jpg"}
// ];

// var count = 0;

// var changeSlide = function(slideNum) {
//   // $('#name_'+slideNum).text(list[count].name);
//   // console.log(  $('#name_'+slideNum).text())
//   $('#crime_'+slideNum).text(list[count].crime);
//   $('#cuisine_'+slideNum).text(list[count].cuisine);
//   $('#range_'+slideNum).text(list[count].range);
//   $('#image_'+slideNum).attr('src', list[count].image);
//   count++;
//   if (count == list.length) {
//     count = 0;
//   }
// }
