/*
  Navigation
*/
console.log('--> navigation.js');

var $pageOverlay = $('#page-overlay');
var bodyOverlayClass = 'overlay-active';

var $hamburger = $('#mobile-menu');
var $mobileFixed = $('.nav-mobile');
var $mobileNav = $('#nav-mobile-menu');
var $mobileNavLi = $('#nav-mobile-menu li');
var $mobileNavAnchor = $('#nav-mobile-menu li a');
var $mobileNavBounds = $('#nav-mobile-menu-bounds');
var $mobileNavOverlap = $('#nav-mobile-menu-overlap');
var $mobileBar = $('.nav-mobile');


var $liMobileSubmenu = $('#nav-mobile-menu li[data-mobile-opens]');
var $mobileSubmenus = $('#nav-mobile-menu [data-mobile-submenu]');


//  Touch Feedback (material design style)
//  - included here so we don't need to load components.js on legacy pages
//  http://codepen.io/440design/pen/iEztk
//
$(function () {
    var ink, d, x, y;
    $(".feedback, #nav-mobile-menu li").click(function (e) {
        if (window.innerWidth <= 767) {
            if ($(this).find(".feedback-ink").length === 0) {
                $(this).prepend("<span class='feedback-ink'></span>");
            }

            ink = $(this).find(".feedback-ink");
            ink.removeClass("animate");

            if (!ink.height() && !ink.width()) {
                d = Math.max($(this).outerWidth(), $(this).outerHeight());
                ink.css({ height: d, width: d });
            }

            x = e.pageX - $(this).offset().left - ink.width() / 2;
            y = e.pageY - $(this).offset().top - ink.height() / 2;

            ink.css({ top: y + 'px', left: x + 'px' }).addClass("animate");
        }
    });
});


// On Document Ready
$(document).ready(function() {

  // Close mobile nav
  closeNav();

});


// Control Page Overlays
//
function showPageOverlay() {
    $pageOverlay.show();
    TweenLite.to($pageOverlay, .35, { autoAlpha: 1, zIndex:800, ease: Power1.easeInOut });
    TweenLite.to($('main#main-content'), .22, { x:'17px', ease: Power1.easeInOut });
  $('body').addClass(bodyOverlayClass);
}

function hidePageOverlay() {
    TweenLite.to($pageOverlay, .35, { autoAlpha: 0, zIndex: '-2', ease: Power1.easeInOut});
  TweenLite.to($('main#main-content'), .22, { x:0, ease: Power1.easeInOut });
  $('body').removeClass(bodyOverlayClass);
  $pageOverlay.hide();
}

// Hamburger to X
//
function doTheHammy(option) {
  
    // Elements
    var $trigger = $hamburger;
    var $first = $trigger.find('.hammy-special .fir');
    var $second = $trigger.find('.hammy-special .sec');
    var $third = $trigger.find('.hammy-special .thi');

    if (option === "open") {
        TweenLite.to($first, .35, { rotation: "-50px", autoAlpha: 0, ease: Power1.easeInOut });
        TweenLite.to($second, .35, { y: 7, rotation: "-50px", ease: Power1.easeInOut });
        TweenLite.to($third, .35, { y: "-7px", rotation: 50, ease: Power1.easeInOut });
        $trigger.addClass('on');
    }
    if(option === "close") {
        TweenLite.to($first, .35, { rotation: 0, autoAlpha: 1, ease: Power1.easeInOut });
        TweenLite.to($second, .35, { y: 0, rotation: 0, ease: Power1.easeInOut });
        TweenLite.to($third, .35, { y: 0, rotation: 0, ease: Power1.easeInOut });
        $trigger.removeClass('on');
    }

}

// Open & Close Mobile Nav Functions
//
function closeNav() {

  //default
  doTheHammy('close');
  hidePageOverlay();
  TweenLite.to($mobileNav, .3, { x: "-300px", ease: Power1.easeOut })
  $hamburger.removeClass('active');
  $mobileNav.attr("aria-hidden","true");
  //close submenus
  TweenLite.to($mobileSubmenus, .2, { x: "300px", ease: Power1.easeOut });
  $liMobileSubmenu.removeClass('active');
  $liMobileSubmenu.find('a').attr('aria-expanded', 'false');

}

function openNav() {

  doTheHammy('open');
  showPageOverlay();
  TweenLite.to($mobileNav, .25, { x: 0, ease: Power1.easeOut })
  $hamburger.addClass('active');
  $mobileNav.attr("aria-hidden","false");

}

// Hamburger Click Event
//
$hamburger.on('click', function(e) {
  TweenLite.set($mobileNav, { autoAlpha: 1 });
  e.preventDefault();
  
  // Default Action
  if(! $hamburger.hasClass('active')) {
    openNav();
  } else {
    closeNav();
  }

  // Close on Document Click
  $(document).on('click touchstart', function(event) {
    if(!$(event.target).closest($hamburger).length && !$(event.target).closest($mobileNav).length && $hamburger.hasClass('active')) {
        closeNav();
        return false;
    }
  });

  // Close with Escape key
  $(document).keyup(function(e) {
    if (e.which === 27 && $hamburger.hasClass('active')) {
      closeNav();
    }
  });


});

// GSAP Draggable Mobile Instance -  still not quite there =/
//
/*
Draggable.create($mobileNav, {

  type:"x",
  bounds: $mobileNavBounds,
  minimumMovement: 10,
  edgeResistance:.8,
  throwProps: true,
  cursor: 'pointer',

    // Allow both clicking and dragging on links (<a> needs z-index:-1)
    onClick:function(e) {

      var jqueryEvent = $(e.target);
      if(jqueryEvent.is('li')) {
        var link = jqueryEvent.find('a')[0];

        link.click();
        return;

      }

    },

    onDragEnd:function() {
      if (Draggable.hitTest($mobileNav,$mobileNavOverlap, 100)) {
        closeNav();
      } else {
        openNav();
      }
    }

});*/

// Mobile Submenus
//
$liMobileSubmenu.each(function() {

  var self = $(this);
  var menuLink = self.attr('data-mobile-opens');
  var link = $(this).find('[aria-expanded]').first();
  var menu = $('[data-mobile-submenu="' + menuLink + '"]');
  var backLink = menu.find('li.back a');

  link.on('click', function () {
    if(!self.hasClass('active')) {
        TweenLite.to(menu, 0.25, { x: 0, ease: Power1.easeInOut, onComplete: addClass });
        link.attr('aria-expanded', 'true');
    }
  });
  backLink.on('click', function() {
      TweenLite.to(menu, 0.25, { x: 300, ease: Power1.easeInOut, onComplete: removeClass });
      link.attr('aria-expanded', 'false');
  });

  function addClass() {
    self.addClass('active');
    menu.find('.back a').focus();
  };
  function removeClass() {
    self.removeClass('active');
    link.focus();
  };
});