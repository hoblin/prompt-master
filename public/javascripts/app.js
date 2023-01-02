// Micromodal
const showModal = (imageUrl, tagJson) => {
  const tag = JSON.parse(tagJson);
  // Set image
  const imageContainer = document.getElementById("image-modal-content");
  imageContainer.innerHTML = `<img src="${imageUrl}" />`;
  // Set title
  const midalTitle = document.getElementById("image-modal-title");
  midalTitle.innerHTML = tag.name;
  // Init featured button
  const featuredButton = document.getElementById("image-modal-featured");
  const unfeaturedButton = document.getElementById("image-modal-unfeatured");
  featuredButton.style.display = tag.featured ? "none" : "inline-block";
  unfeaturedButton.style.display = tag.featured ? "inline-block" : "none";
  featuredButton.onclick = () => {
    $.ajax({
      url: `/tag/${tag.id}/feature`,
      type: "PUT",
      success: function (result) {
        featuredButton.style.display = "none";
        unfeaturedButton.style.display = "inline-block";
      },
    });
  };
  unfeaturedButton.onclick = () => {
    $.ajax({
      url: `/tag/${tag.id}/unfeature`,
      type: "PUT",
      success: function (result) {
        featuredButton.style.display = "inline-block";
        unfeaturedButton.style.display = "none";
      },
    });
  };

  // Init hide and unhide buttons
  const hideButton = document.getElementById("image-modal-hide");
  const unhideButton = document.getElementById("image-modal-unhide");
  hideButton.style.display = tag.active ? "inline-block" : "none";
  unhideButton.style.display = tag.active ? "none" : "inline-block";
  hideButton.onclick = () => {
    $.ajax({
      url: `/tag/${tag.id}/hide`,
      type: "PUT",
      success: function (result) {
        hideButton.style.display = "none";
        unhideButton.style.display = "inline-block";
      },
    });
  };
  unhideButton.onclick = () => {
    $.ajax({
      url: `/tag/${tag.id}/unhide`,
      type: "PUT",
      success: function (result) {
        hideButton.style.display = "inline-block";
        unhideButton.style.display = "none";
      },
    });
  };

  // Show modal
  MicroModal.show("image-modal");
};

// Top button
function scrollFunction(button) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    button.style.display = "inline-block";
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
const buildSwiperSlider = (sliderElm) => {
  const sliderIdentifier = sliderElm.dataset.id;
  return new Swiper(`#${sliderElm.id}`, {
    loop: true,
  });
};
// Init swipers on page load or when new content is added
function initSwipers() {
  allSliders = document.querySelectorAll(".swiper");
  allSliders.forEach((slider) => {
    if (slider.swiper === undefined) {
      slider.swiper = buildSwiperSlider(slider);
    }
  });
}
function swipeLeft() {
  allSliders.forEach((slider) => {
    if (slider.swiper) {
      console.log("swiping left");
      slider.swiper.slidePrev();
    }
  });
}
function swipeRight() {
  allSliders.forEach((slider) => {
    if (slider.swiper) {
      console.log("swiping right");
      slider.swiper.slideNext();
    }
  });
}

// on load
$(document).ready(function () {
  // Top button
  let topButton = document.getElementById("topBtn");
  window.onscroll = function () {
    scrollFunction(topButton);
  };

  // Swiper slider init
  initSwipers();

  // Listen for infinite scroll events and re-init swipers
  $(document).on(
    "append.infiniteScroll",
    function (event, body, path, items, response) {
      // Rollback all swipers if there are elements added to the page
      if (items.length > 0) {
        allSliders.forEach((slider) => {
          if (slider.swiper) {
            slider.swiper.slideToLoop(0);
          }
        });
        initSwipers();
      }
    }
  );

  // Init clipboard
  new ClipboardJS(".modal__copy");
});
