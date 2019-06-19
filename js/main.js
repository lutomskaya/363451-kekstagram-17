'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAMES = ['Иван', 'Карл', 'Даня', 'Паша', 'Стас', 'Рома'];

var COMMENTS_MIN = 0;
var COMMENTS_MAX = 7;

var AVATARS_MIN = 1;
var AVATARS_MAX = 6;

var LIKES_MIN = 15;
var LIKES_MAX = 200;

var PHOTOS_QUANTITY = 25;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var SIZE_MIN = 25;
var SIZE_MAX = 100;
var SIZE_STEP = 25;
var DEFOLT_FILTER_VALUE = 100;

var currentScaleValue = DEFOLT_FILTER_VALUE;

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
var pictureList = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

var imgUpload = document.querySelector('.img-upload');
var uploadFile = imgUpload.querySelector('#upload-file');
var uploadOverlay = imgUpload.querySelector('.img-upload__overlay');
var uploadClose = imgUpload.querySelector('.img-upload__cancel');
var scaleUpButton = imgUpload.querySelector('.scale__control--bigger');
var scaleDownButton = imgUpload.querySelector('.scale__control--smaller');
var scaleInput = imgUpload.querySelector('.scale__control--value');
var imgUploadPreview = imgUpload.querySelector('.img-upload__preview');

var slider = imgUpload.querySelector('.effect-level__pin');
var levelLine = imgUpload.querySelector('.effect-level__line');
var effectLevel = imgUpload.querySelector('.effect-level');
var effectValueElement = effectLevel.querySelector('.effect-level__value');
var effectsList = document.querySelector('.effects__list');
var effectsRadioElements = effectsList.querySelectorAll('.effects__radio');

var img = imgUploadPreview.querySelector('img');

var getRandomElement = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// открытие / закрытие окна редактирования фотографии

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  uploadOverlay.classList.remove('hidden');

  effectsRadioElements[0].checked = true;
  scaleInput.value = '100%';
  img.className = '';
  img.style.filter = 'none';

  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  uploadFile.value = '';
  imgUploadPreview.style.transform = '';
  img.className = '';
};

uploadFile.addEventListener('change', function () {
  openPopup();
});

uploadClose.addEventListener('click', function () {
  closePopup();
});

uploadClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

// изменение размера фотографии
var setImagePreviewScale = function (value) {
  scaleInput.value = value + '%';
  imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
};

var outZoom = function () {
  currentScaleValue -= SIZE_STEP;
  setImagePreviewScale(currentScaleValue);
};

var inZoom = function () {
  currentScaleValue += SIZE_STEP;
  setImagePreviewScale(currentScaleValue);
};

scaleDownButton.addEventListener('click', function () {
  if (currentScaleValue > SIZE_MIN) {
    outZoom();
  }
});

scaleDownButton.addEventListener('keydown', function () {
  if (currentScaleValue > SIZE_MIN) {
    outZoom();
  }
});

scaleUpButton.addEventListener('click', function () {
  if (currentScaleValue < SIZE_MAX) {
    inZoom();
  }
});

scaleUpButton.addEventListener('keydown', function () {
  if (currentScaleValue < SIZE_MAX) {
    inZoom();
  }
});

// Применение фильтров
var changeEffects = function (evt) {
  imgUploadPreview.className = '';
  if (evt.target.value !== 'none') {
    effectLevel.classList.remove('hidden');
    imgUploadPreview.classList.add(
        'effects__preview--' + evt.target.value
    );
  }

  if (evt.target.value === 'none') {
    imgUploadPreview.style.filter = '';
    effectLevel.classList.add('hidden');
  }
  if (evt.target.value === 'chrome') {
    imgUploadPreview.style.filter = 'grayscale(1)';
  }
  if (evt.target.value === 'sepia') {
    imgUploadPreview.style.filter = 'sepia(1)';
  }
  if (evt.target.value === 'marvin') {
    imgUploadPreview.style.filter = 'invert(100%)';
  }
  if (evt.target.value === 'phobos') {
    imgUploadPreview.style.filter = 'blur(3px)';
  }
  if (evt.target.value === 'heat') {
    imgUploadPreview.style.filter = 'brightness(3)';
  }
};

effectsRadioElements.forEach(function (item) {
  item.addEventListener('change', function (evt) {
    changeEffects(evt);
  });
});

var changeIntensityEffect = function () {
  effectValueElement.value = (
    slider.offsetLeft / levelLine.clientWidth).toFixed(1);

  if (imgUploadPreview.classList[0] === 'none') {
    imgUploadPreview.style.filter = 'none';
  }

  if (imgUploadPreview.classList[0] === 'chrome') {
    imgUploadPreview.style.filter = 'grayscale(' + effectValueElement.value + ')';
  }
  if (imgUploadPreview.classList[0] === 'sepia') {
    imgUploadPreview.style.filter = 'sepia(' + effectValueElement.value + ')';
  }
  if (imgUploadPreview.classList[0] === 'marvin') {
    imgUploadPreview.style.filter = 'invert(' + effectValueElement.value * 100 + '%)';
  }
  if (imgUploadPreview.classList[0] === 'phobos') {
    imgUploadPreview.style.filter = 'blur(' + (effectValueElement.value * 3) + 'px)';
  }
  if (imgUploadPreview.classList[0] === 'heat') {
    imgUploadPreview.style.filter = 'brightness(' + (effectValueElement.value * 3 + ')');
  }
};

slider.addEventListener('mouseup', function () {
  changeIntensityEffect();
});

var getCommentObject = function () {
  var comments = [];

  for (var i = 0; i <= getRandomElement(COMMENTS_MIN, COMMENTS_MAX); i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomElement(AVATARS_MIN, AVATARS_MAX) + '.svg',
      message: COMMENTS[getRandomElement(0, COMMENTS.length)],
      name: NAMES[getRandomElement(0, NAMES.length)]
    });
  }

  return comments;
};

var getPhotoObject = function (number) {
  var photos = [];
  for (var i = 0; i <= number; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomElement(LIKES_MIN, LIKES_MAX),
      comments: getCommentObject()
    });
  }
  return photos;
};

var renderPicture = function (photo) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;

  return pictureElement;
};

var photos = getPhotoObject(PHOTOS_QUANTITY);

for (var i = 0; i < photos.length - 1; i++) {
  fragment.appendChild(renderPicture(photos[i]));
}

pictureList.appendChild(fragment);
