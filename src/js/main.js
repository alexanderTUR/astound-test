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
