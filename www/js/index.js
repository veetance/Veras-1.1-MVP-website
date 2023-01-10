var app = new Framework7({
  // App root element
  el: "#app",
  // other parameters

  routes: [
    {
      path: "/",
      url: "index.html",
    },

    {
      path: "/page3/",
      url: "pages/page3.html",
    },

    {
      path: "/",
      url: "index.html",
    },

    {
      path: "/index/",
      url: "index.html",
    },
  ],
  

});
var mainView = app.views.create(".view-main");


//address bar theme color
const darkModeQuery = window.matchMedia('not all and (prefers-color-scheme)');
function updateThemeColor(event) {
  if (event.matches) {
    // Dark mode is enabled
    document.querySelector('meta[name=theme-color]').setAttribute('content', '#5e50b2');
  } else {
    // Dark mode is disabled
    document.querySelector('meta[name=theme-color]').setAttribute('content', '#FFFFFF');
  }
}
darkModeQuery.addEventListener('change', updateThemeColor);


//reveal animation
$(document).ready(function() {
  // get the button element
  var vBtni = $('.v-btn-i');

  // add mouseenter and mouseleave event listeners to the button
  vBtni.mouseenter(function() {
    // check if the width of the screen is less than 580px
    if ($(window).width() < 580) {
      // if the width is less than 580px, do not show the div
      return;
    }

    // reveal the div by changing the display to flex and animating the opacity
    $('#').css({
      'display': 'flex',
      'opacity': 0
    }).animate({
      'opacity': 1
    }, 200);
  });
  vBtni.mouseleave(function() {
    // check if the width of the screen is less than 580px
    if ($(window).width() < 580) {
      // if the width is less than 580px, do not hide the div
      return;
    }

    // hide the div by animating the opacity to 0
    $('#').animate({
      'opacity': 0
    }, 200, function() {
      // after the animation, change the display back to none
      $(this).css('display', 'none');
    });
  });
});



function lazyLOAD() {
  // Select all elements with the class of .lazy
  let lazyElements = document.querySelectorAll(".lazy");

  // Set the opacity of each lazy element to 0
  lazyElements.forEach((element) => {
    element.style.opacity = 0;
  });

  // Animate the opacity of each lazy element to 1 on page load
  window.addEventListener("load", () => {
    lazyElements.forEach((element) => {
      element.style.transition = "opacity 1s cubic-bezier(.3,.6,.13,1)";
      element.style.opacity = 1;
    });
  });
}
// call the function on page load
lazyLOAD();


// on first page load function splash() pulses .v-logo-wrapper starting from opacity 0 to opacity 1 ease in and 2 times in 1.5s and then fades out while fading out .v-splash and setting display to none

function splash() {

  document.querySelector("html").style.overflow = "hidden";
  
  let vSplash = document.querySelector(".v-splash");
  let vLogoWrapper = document.querySelector(".v-splash .v-logo-wrapper");
  let vLogo = document.querySelector(".v-splash .v-logo");

  // Add pulse effect to vLogo
  vLogo.style.animation = "pulse 2s ease-in-out infinite";

  vLogoWrapper.style.transition = "opacity 1.5s ease-in 2";
  vLogoWrapper.style.opacity = 1;
  vLogo.style.transition = "opacity 1.5s ease-in 1";
  vLogo.style.opacity = 1;

  setTimeout(() => {
    vSplash.style.transition = "opacity .03s ease-in";
    vSplash.style.opacity = 0;
    setTimeout(() => {
      vSplash.style.display = "none";
      document.querySelector("#app").style.overflowY = "scroll";
      document.querySelector("#app").style.overflow = "overlay";
      // document.querySelector(".view-main").style.overflowY = "scroll";
      // document.querySelector(".view-main").style.overflow = "overlay";

      document.querySelector("html").style.overflow = "auto";
    }, 0);
  }, 900);

  
}

// Add keyframe animation for pulse effect
const pulseAnimation = document.createElement("style");
pulseAnimation.innerHTML = `
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}`;
document.head.appendChild(pulseAnimation);

// Call the function on page load
window.addEventListener("load", splash);



// function contactUS() unhides .contact-us-modal-wrapper in a fade anamation cubic-bezier(.3,.6,.13,1) by setting the display to flex on the touch or press of .nav-button lastly, if the.contact-us-modal-wrapper is already visible it hides it again.

const navButton = document.querySelector(".nav-button");
const vFormBtn = document.querySelector("#v-form-btn");
const contactUsModalWrapper = document.querySelector(".contact-us-modal-wrapper");
const contactUsModal = document.querySelector(".contact-us-modal");

function contactUS() {


  document.querySelector(".view, .view-main").style.overflow = "overlay";

  document.querySelector(".navbar-wrapper").style.height = "fit-content";


 
  if (window.getComputedStyle(contactUsModalWrapper).display === "flex") {
    contactUsModalWrapper.style.transition = "opacity .05s cubic-bezier(0,.74,.51,1)";
    contactUsModalWrapper.style.opacity = 0;
    contactUsModal.style.transition = "opacity .01s cubic-bezier(0,.74,.51,1)";
    contactUsModal.style.opacity = 0;

   
    

    


  } else {
    document.querySelector(".view, .view-main").style.overflow = "hidden";
    document.querySelector(".navbar-wrapper").style.height = "100vh";

    contactUsModalWrapper.style.display = "flex";
    contactUsModalWrapper.style.transition = "opacity .01s cubic-bezier(0,.74,.51,1)";
    contactUsModalWrapper.style.opacity = 1;
    contactUsModal.style.transition = "opacity .5s cubic-bezier(0,.74,.51,1)";
    contactUsModal.style.opacity = 1;
  }
}

navButton.addEventListener("click", contactUS);
vFormBtn.addEventListener("click", contactUS);

// or, for touch events:
navButton.addEventListener("touchend", contactUS);
vFormBtn.addEventListener("touchend", contactUS);



contactUsModalWrapper.addEventListener("transitionend", function() {
  if (contactUsModalWrapper.style.opacity == 0) {
    contactUsModalWrapper.style.display = "none";
  }
});




// responsive nnavTitle
function navTitle() {
  let navTitle = document.querySelector(".nav-title");
  let navBar = document.querySelector(".nav-bar");
  let navL = document.querySelector(".nav-L");

  if (navBar.offsetWidth < 708) {// its actually 720
    navL.insertBefore(navTitle, navL.childNodes[2]);
  } else {
    navBar.insertBefore(navTitle, navBar.childNodes[2]);
  }
}
window.addEventListener("resize", navTitle);
navTitle();


