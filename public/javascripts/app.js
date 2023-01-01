// Micromodal
const showModal = (imageUrl, tagName) => {
  const imageContainer = document.getElementById('image-modal-content');
  imageContainer.innerHTML = `<img src="${imageUrl}" />`;
  const midalTitle = document.getElementById('image-modal-title');
  midalTitle.innerHTML = tagName;
  MicroModal.show('image-modal');
}

// Top button
function scrollFunction(button) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Swiper slider
let allSliders;
// Function that actually builds the swiper
const buildSwiperSlider = sliderElm => {
  const sliderIdentifier = sliderElm.dataset.id;
  return new Swiper(`#${sliderElm.id}`);
}
// Init swipers on page load or when new content is added
function initSwipers() {
  allSliders = document.querySelectorAll('.swiper');
  allSliders.forEach((slider) => {
    if (slider.swiper === undefined) {
      slider.swiper = buildSwiperSlider(slider);
    }
  });
}
function swipeLeft() {
  allSliders.forEach((slider) => {
    if (slider.swiper) {
      console.log('swiping left');
      slider.swiper.slidePrev();
    }
  });
}
function swipeRight() {
  allSliders.forEach((slider) => {
    if (slider.swiper) {
      console.log('swiping right');
      slider.swiper.slideNext();
    }
  });
}

// on load
$(document).ready(function () {
  // Top button
  let topButton = document.getElementById("topBtn");
  window.onscroll = function () { scrollFunction(topButton) };

  // Swiper slider init
  initSwipers();

  // Listen for infinite scroll events and re-init swipers
  $(document).on('append.infiniteScroll', function (event, body, path, items, response) {
    // Rollback all swipers if there are elements added to the page
    if (items.length > 0) {
      allSliders.forEach((slider) => {
        if (slider.swiper) {
          slider.swiper.slideTo(0);
        }
      });
      initSwipers();
    }
  });
});



