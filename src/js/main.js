// Open/close social share block
const socialShareOpenButton = document.querySelector('.social-share-widget__open-button');
const socialShareCloseButton = document.querySelector('.social-share-widget__close-button');
const socialShareWidgetBlock = document.querySelector('.social-share-widget__block');

if (socialShareOpenButton) {
  socialShareOpenButton.addEventListener('click', () => {
    socialShareWidgetBlock.classList.add('social-share-widget__block_opened');
  });
}

if (socialShareCloseButton) {
  socialShareCloseButton.addEventListener('click', () => {
    socialShareWidgetBlock.classList.remove('social-share-widget__block_opened');
  });
}

// Form
const form = document.querySelector('.add-to-cart-form');
const formSubmitButton = document.querySelector('.add-to-cart-form__submit');
const productName = document.querySelector('.product-card__heading');
const productPrice = document.querySelector('.product-card__price_discount span');
const productNameTarget = document.getElementById('itemName');
const productCodeTarget = document.getElementById('itemCode');
const productPriceTarget = document.getElementById('itemPrice');
const productSizeTarget = document.getElementById('itemSize');
const productColorTarget = document.getElementById('itemColor');

if (formSubmitButton) {
  formSubmitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const pickedSize = data.get('size');
    const pickedColor = data.get('color');
    form.reset();
    productNameTarget.textContent = productName.textContent;
    productPriceTarget.textContent = productPrice.textContent;
    productSizeTarget.textContent = pickedSize;
    productColorTarget.textContent = pickedColor;
    MicroModal.show('addToCartFormResult', {
      disableScroll: true,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    });
  });
}

// Swiper slider
let swiper;
let init = false;

function swiperMode() {
  const mobile = window.matchMedia('(min-width: 0px) and (max-width: 767px)');
  const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
  const desktop = window.matchMedia('(min-width: 1025px)');

  // Enable swiper (for mobile)
  if (mobile.matches) {
    if (!init) {
      init = true;
      swiper = new Swiper('.swiper-container', {
        loop: true,
        spaceBetween: 100,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }

  // Disable swiper (for tablet)
  else if (tablet.matches) {
    if (swiper) {
      swiper.destroy();
      init = false;
    }
  }

  // Disable swiper (for desktop)
  else if (desktop.matches) {
    if (swiper) {
      swiper.destroy();
      init = false;
    }
  }
}

// Check swiper state on Load
window.addEventListener('load', function () {
  swiperMode();
});

// Check swiper state on Resize
window.addEventListener('resize', function () {
  swiperMode();
});
