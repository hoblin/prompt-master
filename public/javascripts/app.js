// Tags collection.
// Once collect-tag button pressed textfield appears and tag is added to that comma-separated collection.
let tagCollection = [];
// accepts JSON string with tag data
const collectTag = (tag) => {
  const tagData = JSON.parse(tag);
  const tagCollectionFloat = document.getElementById("tag-collection");
  // display float block if it's hidden
  tagCollectionFloat.style.display = "inline-block";
  const tagCollectionInput = document.getElementById("tag-collection-input");
  // add tag to collection
  tagCollection.push(tagData.name);
  // update textfield
  tagCollectionInput.value = tagCollection.join(", ");
};
// clean collection
const cleanCollection = () => {
  const tagCollectionFloat = document.getElementById("tag-collection");
  const tagCollectionInput = document.getElementById("tag-collection-input");
  tagCollection = [];
  tagCollectionInput.value = "";
  tagCollectionFloat.style.display = "none";
};

// Bootstrap 5 modal
let imageModal;
const showModal = (imageUrl, tagJson) => {
  const tag = JSON.parse(tagJson);
  // Set image
  const imageContainer = document.getElementById("image-modal-content");
  imageContainer.innerHTML = `<img src="${imageUrl}" />`;
  // Set title
  const modalTitle = document.getElementById("image-modal-title");
  modalTitle.innerHTML = tag.name;
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
        // remove tag block from page with parent
        const tagBlock = document.getElementById(`tag-${tag.id}`);
        tagBlock.parentElement.remove();
        // close modal
        imageModal.hide();
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
        // remove tag block from page
        const tagBlock = document.getElementById(`tag-${tag.id}`);
        tagBlock.parentElement.remove();
        // close modal
        imageModal.hide();
      },
    });
  };

  // Init button to collect tag
  const collectButton = document.getElementById("image-modal-collect-tag");
  collectButton.onclick = () => {
    collectTag(tagJson);
    imageModal.hide();
  };

  // Show modal
  imageModal.show();
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
    if (
      slider.swiper !== undefined &&
      slider.swiper !== null &&
      slider.swiper.slidePrev !== undefined
    ) {
      slider.swiper.slidePrev();
    }
  });
}
function swipeRight() {
  allSliders.forEach((slider) => {
    if (
      slider.swiper !== undefined &&
      slider.swiper !== null &&
      slider.swiper.slideNext !== undefined
    ) {
      slider.swiper.slideNext();
    }
  });
}

// on load
$(document).ready(function () {
  // Init Bootstrap modal
  if (imageModal === undefined) {
    imageModal = new bootstrap.Modal(
      document.getElementById("image-modal"),
      {}
    );
  }

  // Top button
  let topButton = document.getElementById("topBtn");
  window.onscroll = function () {
    scrollFunction(topButton);
  };

  // Infinite scroll init
  let elem = document.querySelector("#infinite-scroll");
  let infScroll = new InfiniteScroll(elem, {
    // options
    path: ".next_page",
    append: ".tag-container",
    history: false,
    prefill: true,
    hideNav: ".pagination",
    scrollThreshold: 500,
    onError: function (msg) {
      console.error(msg);
    },
  });

  $(elem).on("error.infiniteScroll", function (event, error, path, response) {
    console.error(`Could not load: ${path}. ${error}`);
  });

  // Swiper slider init
  initSwipers();

  // Listen for infinite scroll events and re-init swipers
  $(document).on(
    "append.infiniteScroll",
    function (event, body, path, items, response) {
      // Rollback all swipers if there are elements added to the page
      if (items.length > 0) {
        allSliders.forEach((slider) => {
          if (
            slider.swiper !== undefined &&
            slider.swiper !== null &&
            slider.swiper.slideToLoop !== undefined
          ) {
            slider.swiper.slideToLoop(0);
          }
        });
        initSwipers();
      }
    }
  );

  // init button to clean collection
  const cleanCollectionButton = document.getElementById("tag-collection-clear");
  cleanCollectionButton.onclick = () => {
    cleanCollection();
  };
  // init button to copy collection to clipboard
  new ClipboardJS("#tag-collection-copy");

  // Init clipboard
  new ClipboardJS(".modal-copy");
});
