'use strict';
(function () {

  // Константы клавиш
  var Keycode = {
    ENTER: 13,
    ESC: 27
  };

  // Размеры пользовательского пина
  var NEEDLE_HEIGHT = 22;
  var USER_PIN_SIZE = {
    x: 62,
    y: 62
  };

  // Базовое положение пользовательского пина
  var USER_PIN_CENTER_POSITION = 'left: 570px; top: 375px;';

  // Внутренние границы карты
  var INNER_BORDER = {
    top: 130,
    bottom: 630,
    right: 1136,
    left: 0
  };

  var cityMap = document.querySelector('.map');
  var mapPinMain = cityMap.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');
  var main = document.querySelector('main');
  var resetButton = document.querySelector('.ad-form__reset');
  var mapPin = cityMap.querySelector('.map__pins');
  var mapFilters = cityMap.querySelector('.map__filters');
  var filterSelects = mapFilters.querySelectorAll('.map__filter');
  var filterCheckboxes = mapFilters.querySelectorAll('.map__checkbox');

  // Реакция на клавишу ENTER
  var onDocumentEnterPress = function (evt) {
    if (evt.keyCode === Keycode.ENTER) {
      onButtonMouseUp();
      document.removeEventListener('keydown', onDocumentEnterPress);
    }
  };
  document.addEventListener('keydown', onDocumentEnterPress);

  // Реакция на клавишу ESC
  var onEscPress = function (evt) {
    if (evt.keyCode === Keycode.ESC) {
      var renderedCard = cityMap.querySelector('article');
      var elementSuccess = main.querySelector('.success');
      var elementError = main.querySelector('.error');

      if (renderedCard) {
        cityMap.removeChild(renderedCard);
      }
      if (elementSuccess) {
        main.removeChild(elementSuccess);
      }
      if (elementError) {
        main.removeChild(elementError);
      }
    }
  };
  document.addEventListener('keydown', onEscPress);

  // Реакция клика на произвольную область
  var onDocumentClick = function () {
    var elementSuccess = main.querySelector('.success');
    var elementError = main.querySelector('.error');
    if (elementSuccess) {
      main.removeChild(elementSuccess);
    }
    if (elementError) {
      main.removeChild(elementError);
    }
    document.removeEventListener('click', window.citymap.onDocumentClick);
  };

  // Заблокировать форму до активации карты Токио
  var deactivateForm = function () {
    [].forEach.call(formFieldsets, function (item) {
      item.disabled = 'disabled';
    });
    [].forEach.call(filterSelects, function (item) {
      item.disabled = 'disabled';
    });
    [].forEach.call(filterCheckboxes, function (item) {
      item.disabled = 'disabled';
    });
  };
  deactivateForm();

  // Активация карты Токио и формы
  var onButtonMouseUp = function () {
    cityMap.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    [].forEach.call(formFieldsets, function (item) {
      item.disabled = '';
    });
    window.backend.load(window.renderpins.successHandler, window.renderpins.errorHandler);
    mapPinMain.removeEventListener('mouseup', onButtonMouseUp);
  };
  mapPinMain.addEventListener('mouseup', onButtonMouseUp);

  // Реакция на нажатие кнопки "очистить"
  var restartPage = function () {
    adForm.reset();
    mapFilters.reset();
    deactivateForm();
    cityMap.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mapPinMain.style = USER_PIN_CENTER_POSITION;
    mapPinMain.addEventListener('mouseup', onButtonMouseUp);
    var mapPins = cityMap.querySelectorAll('.map__pin');
    [].forEach.call(mapPins, function (pin) {
      pin.remove();
    });
    var renderedCard = cityMap.querySelector('article');
    if (renderedCard) {
      cityMap.removeChild(renderedCard);
    }
    var placeImages = document.querySelectorAll('.ad-form__photo-preview');
    [].forEach.call(placeImages, function (img) {
      img.remove();
    });
    var preview = document.querySelector('.ad-form__user-pic');
    preview.src = 'img/muffin-grey.svg';
    mapPin.appendChild(mapPinMain);
    document.addEventListener('keydown', onDocumentEnterPress);
  };
  resetButton.addEventListener('click', restartPage);

  // Движение пользовательского пина по карте Токио
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var cordsX = mapPinMain.offsetLeft - shift.x;
      var cordsY = mapPinMain.offsetTop - shift.y;

      if (cordsX > INNER_BORDER.left && cordsX < INNER_BORDER.right) {
        mapPinMain.style.left = cordsX + 'px';
      }
      if (cordsY > INNER_BORDER.top && cordsY < INNER_BORDER.bottom) {
        mapPinMain.style.top = cordsY + 'px';
      }
      adForm.querySelector('#address').value = (parseInt(mapPinMain.style.left, 10) - USER_PIN_SIZE.x / 2) + ',' + (parseInt(mapPinMain.style.top, 10) - USER_PIN_SIZE.y + NEEDLE_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.citymap = {
    onDocumentClick: onDocumentClick,
    restartPage: restartPage
  };

})();
