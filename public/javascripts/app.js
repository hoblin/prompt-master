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

//Translate text from english to russian using RapidAPI
const translate = (string, targetDomEle) => {
  // add .loading class to target element
  targetDomEle.classList.add("loading");
  const settings = {
    async: true,
    crossDomain: true,
    url: "https://nlp-translation.p.rapidapi.com/v1/translate",
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": rapidAPI_key,
      "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
    },
    data: {
      text: string,
      to: "ru",
      from: "en",
    },
  };
  $.ajax(settings).done(function (response) {
    targetDomEle.innerHTML = response.translated_text.ru;
    // remove .loading class from target
    targetDomEle.classList.remove("loading");
  });
};

// Bootstrap 5 modal
let imageModal;
const showModal = (imageUrl, tagId) => {
  // Get tag data from tag card in DOM by tagId
  const tagBlock = document.getElementById(`tag-${tagId}`);
  const tagFeatured = tagBlock.classList.contains("featured");
  const tagHidden = tagBlock.classList.contains("hidden");
  const tagName = tagBlock.querySelector(".card-title").innerHTML;
  // Set image
  const imageContainer = document.getElementById("image-modal-content");
  imageContainer.innerHTML = `<img src="${imageUrl}" />`;
  // Set title
  const modalTitle = document.getElementById("image-modal-title");
  modalTitle.innerHTML = tagName;
  // Init featured buttons
  const featuredButtons = document.querySelectorAll(".image-modal-featured");
  const unfeaturedButtons = document.querySelectorAll(
    ".image-modal-unfeatured"
  );
  featuredButtons.forEach((button) => {
    button.style.display = tagFeatured ? "none" : "inline-block";
    button.onclick = () => {
      $.ajax({
        url: `/tag/${tagId}/feature`,
        type: "PUT",
        success: function (_result) {
          featuredButtons.forEach((button) => {
            button.style.display = "none";
          });
          unfeaturedButtons.forEach((button) => {
            button.style.display = "inline-block";
          });
          // show featured icon
          const tagBlock = document.getElementById(`tag-${tagId}`);
          tagBlock.classList.add("featured");
          // close modal
          imageModal.hide();
        },
      });
    };
  });

  unfeaturedButtons.forEach((button) => {
    button.style.display = tagFeatured ? "inline-block" : "none";
    button.onclick = () => {
      $.ajax({
        url: `/tag/${tagId}/unfeature`,
        type: "PUT",
        success: function (_result) {
          featuredButtons.forEach((button) => {
            button.style.display = "inline-block";
          });
          unfeaturedButtons.forEach((button) => {
            button.style.display = "none";
          });
          // hide featured icon
          const tagBlock = document.getElementById(`tag-${tagId}`);
          tagBlock.classList.remove("featured");
          // close modal
          imageModal.hide();
        },
      });
    };
  });

  // Init hide and unhide buttons
  const hideButtons = document.querySelectorAll(".image-modal-hide");
  const unhideButtons = document.querySelectorAll(".image-modal-unhide");
  hideButtons.forEach((button) => {
    button.style.display = tagHidden ? "none" : "inline-block";
    button.onclick = () => {
      $.ajax({
        url: `/tag/${tagId}/hide`,
        type: "PUT",
        success: function (_result) {
          hideButtons.forEach((button) => {
            button.style.display = "none";
          });
          unhideButtons.forEach((button) => {
            button.style.display = "inline-block";
          });
          // remove tag block from page with parent
          const tagBlock = document.getElementById(`tag-${tagId}`);
          tagBlock.parentElement.remove();
          // close modal
          imageModal.hide();
        },
      });
    };
  });
  unhideButtons.forEach((button) => {
    button.style.display = tagHidden ? "inline-block" : "none";
    button.onclick = () => {
      $.ajax({
        url: `/tag/${tagId}/unhide`,
        type: "PUT",
        success: function (_result) {
          hideButtons.forEach((button) => {
            button.style.display = "inline-block";
          });
          unhideButtons.forEach((button) => {
            button.style.display = "none";
          });
          // remove tag block from page
          const tagBlock = document.getElementById(`tag-${tagId}`);
          tagBlock.parentElement.remove();
          // close modal
          imageModal.hide();
        },
      });
    };
  });

  // Init button to collect tag
  const collectButtons = document.querySelectorAll(".image-modal-collect-tag");
  collectButtons.forEach((button) => {
    button.onclick = () => {
      collectTag(tagJson);
      imageModal.hide();
    };
  });

  // Init translate tag name button
  const translateButtons = document.querySelectorAll(".image-modal-translate");
  translateButtons.forEach((button) => {
    button.onclick = () => {
      const targetDomEle = document.getElementById("image-modal-title");
      translate(tag.name, targetDomEle);
    };
  });

  // Show modal
  imageModal.show();
};

// Function to delete tag from database on button click
// with confirmation modal

// confirm delete modal for tag and category
let confirmDeleteModal;
const confirmDeleteModalShow = (kind, id, name) => {
  const confirmDeleteModalTitle = document.getElementById(
    "confirm-delete-modal-title"
  );
  confirmDeleteModalTitle.innerHTML = `Delete ${kind} "${name}"?`;
  const confirmDeleteModalBody = document.getElementById(
    "confirm-delete-modal-body"
  );
  confirmDeleteModalBody.innerHTML = `Are you sure you want to delete this ${kind}? All images associated with this ${kind} will be deleted and cannot be recovered.`;
  const confirmDeleteModalButton = document.getElementById(
    "confirm-delete-modal-button"
  );
  confirmDeleteModalButton.onclick = () => {
    if (kind === "tag") {
      deleteTag(id);
    } else if (kind === "category") {
      deleteCategory(id);
    }
  };
  confirmDeleteModal.show();
};

// DELETE request to /tag/:id
function deleteTag(tagId) {
  $.ajax({
    url: `/tag/${tagId}`,
    type: "DELETE",
    success: function (result) {
      // remove tag block from page
      const tagBlock = document.getElementById(`tag-${tagId}`);
      tagBlock.parentElement.remove();
      // close modal
      confirmDeleteModal.hide();
    },
  });
}

// DELETE request to /category/:id
function deleteCategory(categoryId) {
  $.ajax({
    url: `/category/${categoryId}`,
    type: "DELETE",
    success: function (result) {
      // redirect to home page
      window.location.href = "/";
    },
  });
}

// Top button
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
// Bottom button
function bottomFunction() {
  document.body.scrollTop = document.body.scrollHeight;
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

// Swiper slider
let allSliders;
// Function that actually builds the swiper
const buildSwiperSlider = (sliderElm) => {
  const sliderIdentifier = sliderElm.dataset.id;
  return new Swiper(`#${sliderElm.id}`, {
    loop: true,
    // cssMode: true, // Enable CSS mode to improve performance
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

// rate tag
function rateTag(tagId, rating) {
  $.ajax({
    url: `/tag/${tagId}/rate`,
    type: "PUT",
    data: { rank: 6 - rating },
    success: function (result) {
      // update rating radio button
      const ratingElm = document.getElementById(`tag${tagId}-star${rating}`);
      ratingElm.checked = true;
    },
  });
}

// on load
$(document).ready(function () {
  // Init image modal
  if (imageModal === undefined) {
    imageModal = new bootstrap.Modal(
      document.getElementById("image-modal"),
      {}
    );
  }

  // Init confirm delete modal
  if (confirmDeleteModal === undefined) {
    confirmDeleteModal = new bootstrap.Modal(
      document.getElementById("confirm-delete-modal"),
      {}
    );
  }

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
