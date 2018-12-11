'use strict';
(function () {

// Объект типов жилищ
  var PlaceType = {
    palace: 'Дворец',
    house: 'Дом',
    flat: 'Квартира',
    bungalo: 'Бунгало'
  };

  var cityMap = document.querySelector('.map');
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  // Создание карточки пина
  window.renderCard = function (pin) {
    var elementCard = mapCardTemplate.cloneNode(true);
    elementCard.querySelector('.popup__avatar').src = pin.author.avatar;
    elementCard.querySelector('.popup__title').textContent = pin.offer.title;
    elementCard.querySelector('.popup__text--price').textContent = pin.offer.price + ' ₽/ночь';
    elementCard.querySelector('.popup__type').textContent = PlaceType[pin.offer.type];
    elementCard.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    elementCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;

    var randomFeatures = pin.offer.features;
    var popupFeatures = elementCard.querySelector('.popup__features');
    elementCard.removeChild(popupFeatures);

    if (randomFeatures.length > 0) {
      var elementUl = document.createElement('ul');
      elementUl.classList.add('popup__features');
      elementCard.appendChild(elementUl);

      [].forEach.call(randomFeatures, function (item) {
        var elementLi = document.createElement('li');
        elementLi.classList.add('popup__feature');
        elementLi.classList.add('popup__feature--' + (item + ''));
        elementUl.appendChild(elementLi);
      });
    }

    elementCard.querySelector('.popup__description').textContent = pin.offer.description;

    var randomPhotos = pin.offer.photos;
    var popupPhotos = elementCard.querySelector('.popup__photos');
    elementCard.removeChild(popupPhotos);

    if (randomPhotos.length > 0) {
      var elementDIV = document.createElement('div');
      elementCard.appendChild(elementDIV);
      elementDIV.classList.add('popup__photos');

      [].forEach.call(randomPhotos, function (item) {
        var elementIMG = document.createElement('img');
        elementIMG.classList.add('popup__photo');
        elementIMG.width = 45;
        elementIMG.height = 40;
        elementIMG.src = item;
        elementIMG.alt = 'Фотография жилья';
        elementDIV.appendChild(elementIMG);
      });
    }
    var popupClose = elementCard.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      cityMap.removeChild(elementCard);
    });
    return elementCard;
  };

})();
