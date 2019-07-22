'use strict';
(function () {

  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var pictureList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  var renderPicture = function (photo) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;

    pictureElement.addEventListener('click', onPictureClick);

    return pictureElement;

    function onPictureClick(evt) {
      evt.preventDefault();
      window.bigPicture.open(photo);
    }
  };

  var clearPictures = function () {
    pictureList.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var displayPictures = function (pictureItems) {
    clearPictures();

    for (var i = 0; i < pictureItems.length; i++) {
      var picture = renderPicture(pictureItems[i]);
      fragment.appendChild(picture);
    }
    pictureList.appendChild(fragment);
  };

  var onError = function (errorMessage) {
    var block = document.createElement('div');
    block.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    block.style.position = 'absolute';
    block.style.left = 0;
    block.style.right = 0;
    block.style.fontSize = '50px';

    block.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', block);
  };

  window.backend.load(window.filter.init, onError);

  window.gallery = {
    render: displayPictures
  };
})();
