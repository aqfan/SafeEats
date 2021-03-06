//List of restaurants and their information
var list = [];

//Hide the Yes and Eww Text
$(".yes").hide();
$(".no").hide();
$(".pleaseWait").show();

$(function(){
  $(".action-logout").click(function(e){
    $.ajax({
      url: "/logout",
      type: 'GET',
      success: function(res) {
        alert("You've been logged out!");
        window.location.href = "/";
      }
    })
  })
});

$.ajax({
  url: "/getRestaurants",
  type: 'GET',
  success: function(arr) {
    for(var i = 0; i < arr.length; i++) {
      var element = {};
      element.names = arr[i][3];
      element.crime = arr[i][8];
      element.range = arr[i][5];
      element.image = "images/photos/"+arr[i][1]+".jpg";
      element.id = arr[i][2];
      list.push(element);
    }
    runRest();
  }
});

function runRest() {

  //Insert HTML for the restaurants
  var a;
  var b;
  var dollarText;
  var crimeText;
  for (a = 0; a < list.length; a++) {
    dollarText = "";
    for(b = 0; b < list[a].range; b++) {
      dollarText = dollarText + "$";
    }

    if (list[a].crime < 1453) {
      crimeText = 'Safe';
    } else if (list[a].crime < 6608) {
      crimeText = 'Relatively Safe';
    } else if (list[a].crime < 16799) {
      crimeText = 'A little dangerous';
    } else {
      crimeText = 'Dangerous';
    }

    document.getElementById('image_slider').innerHTML = document.getElementById('image_slider').innerHTML +
    '<div class="item"><img id="image_' + a + '" src="' + list[a].image + '" /></div>';
    document.getElementById('text_slider').innerHTML = document.getElementById('text_slider').innerHTML +
    '<div class="item" id="' + a + '"><span id="names_' + a + '">' + list[a].names +
    '</span><span>Crime:<text id="crime_' + a + '">' + crimeText +
    '</text></span><span id="range_' + a + '">' + dollarText + '</span></div>';
  }

  $(".pleaseWait").hide();

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

  var currSlide = 0;
  var currId = 0;
  var currName = "";

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
      currId = list[currSlide].id;
      currName = list[currSlide].names;
      console.log(currId);
      //add to my restaurants
      $.ajax({
        url: "/checkMyRestaurant",
        type: 'GET',
        data: {id: currId},
        success: function(arr) {
          if(arr.length == 0) {
            $.ajax({
              url: "/addMyRestaurant",
              type: 'GET',
              data: {id: currId},
              success: function(arr) {
                console.log("Saved " + currName + "!");
              }
            });
          };
        }
      });

      currSlide++;
      if(currSlide == list.length) {
        currSlide = 0;
      }
    } else if (event.keyCode == 40) {
      $(".no").show();
      currSlide++;
      if(currSlide == list.length) {
        currSlide = 0;
      }
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
}
