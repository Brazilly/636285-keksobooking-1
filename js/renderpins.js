'use strict';
(function () {

  // Размеры пина других пользователей
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var TIMEOUT = 1000;

  var cityMap = document.querySelector('.map');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapFilters = cityMap.querySelector('.map__filters-container');
  var mapPin = cityMap.querySelector('.map__pins');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorTemplateMessage = errorTemplate.querySelector('.error__message');
  var main = document.querySelector('main');
  var mapPinMain = cityMap.querySelector('.map__pin--main');
  var filterSelects = mapFilters.querySelectorAll('.map__filter');
  var filterCheckboxes = mapFilters.querySelectorAll('.map__checkbox');

  // Отрисовка пина
  function renderPin(pin) {
    var elementPin = mapPinTemplate.cloneNode(true);

    elementPin.style = 'left: ' + (pin.location.x - PIN_WIDTH / 2) + 'px;' + ' top: ' + (pin.location.y - PIN_HEIGHT) + 'px';
    elementPin.querySelector('img').src = pin.author.avatar;
    elementPin.querySelector('img').alt = pin.offer.title;

    elementPin.addEventListener('click', function () {
      var testCard = cityMap.querySelector('.map__card');
      var mapPins = cityMap.querySelectorAll('.map__pin');

      [].forEach.call(mapPins, function (item) {
        item.classList.remove('map__pin--active');
      });

      if (testCard) {
        elementPin.classList.add('map__pin--active');
        cityMap.removeChild(testCard);
        cityMap.insertBefore(window.renderCard(pin), mapFilters);
      } else {
        elementPin.classList.add('map__pin--active');
        cityMap.insertBefore(window.renderCard(pin), mapFilters);
      }
    });
    return elementPin;
  }

  // Добавление на карту пинов других пользователей и активация фильтра
  function successHandler(pins) {
    window.pins = pins;
    var fragmentPins = document.createDocumentFragment();
    for (var i = 0; i < 5; i++) {
      fragmentPins.appendChild(window.renderpins.renderPin(pins[i]));
    }
    mapPin.appendChild(fragmentPins);

    [].forEach.call(filterSelects, function (item) {
      item.disabled = '';
    });
    [].forEach.call(filterCheckboxes, function (item) {
      item.disabled = '';
    });
  }

  // Добавление сообщения ошибки
  function errorHandler(errorMessage) {
    errorTemplateMessage.textContent = errorMessage;
    var elementError = errorTemplate.cloneNode(true);
    main.appendChild(elementError);
    var errorButton = document.querySelector('.error');
    errorButton.addEventListener('click', function () {
      main.removeChild(elementError);
      window.backend.load(window.renderpins.successHandler, window.renderpins.errorHandler);
    });
    document.addEventListener('click', window.citymap.onDocumentClick);
  }

  // Обработчик Change на селектах фильтра
  [].forEach.call(filterSelects, function (select) {
    select.addEventListener('change', onFilterChange);
  });

  // Обработчик Change на чекбоксах фильтра
  [].forEach.call(filterCheckboxes, function (checkbox) {
    checkbox.addEventListener('change', onFilterChange);
  });

  // Дебаунс
  var lastTimeout;

  function onFilterChange() {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
      lastTimeout = null;
    }
    lastTimeout = setTimeout(function () {
      updatePins();
    }, TIMEOUT);
  }

  // Фильтрация пинов
  function updatePins() {
    var filtredPins = [];

    [].forEach.call(window.pins, function (pin) {
      var matchFilter = true;

      [].forEach.call(filterSelects, function (select) {
        var selectValue = select.value;

        if (selectValue === 'any') {
          return;
        }

        if (select.name === 'housing-type') {
          if (pin.offer.type !== selectValue) {
            matchFilter = false;
          }
        }

        if (select.name === 'housing-price') {
          var offerPrice = pin.offer.price;

          if (offerPrice >= 0 && offerPrice < 10000) {
            offerPrice = 'low';
          }
          if (offerPrice >= 10000 && offerPrice < 50000) {
            offerPrice = 'middle';
          }
          if (offerPrice > 50000) {
            offerPrice = 'high';
          }
          if (offerPrice !== selectValue) {
            matchFilter = false;
          }
        }

        if (select.name === 'housing-rooms') {
          if (pin.offer.rooms + '' !== selectValue) {
            matchFilter = false;
          }
        }

        if (select.name === 'housing-guests') {
          if (pin.offer.guests + '' !== selectValue) {
            matchFilter = false;
          }
        }
      });

      if (matchFilter) {
        var checkedCheckboxes = mapFilters.querySelectorAll('input:checked');
        if (checkedCheckboxes.length > 0) {
          var pinFeatures = pin.offer.features;
          if (pinFeatures.length > 0) {
            matchFilter = false;
          }
          for (var i = 0; i < checkedCheckboxes.length; i++) {
            matchFilter = (pinFeatures.indexOf(checkedCheckboxes[i].value) !== -1);
            if (!matchFilter) {
              break;
            }
          }
        }
      }

      if (matchFilter) {
        filtredPins.push(pin);
      }
    });

    var firstFiveFiltredPins = filtredPins.splice(0, 5);

    var existingPins = cityMap.querySelectorAll('.map__pin');

    [].forEach.call(existingPins, function (pin) {
      pin.remove();
    });

    var fragmentPins = document.createDocumentFragment();

    [].forEach.call(firstFiveFiltredPins, function (pin) {
      fragmentPins.appendChild(window.renderpins.renderPin(pin));
    });
    var renderedCard = cityMap.querySelector('article');
    if (renderedCard) {
      cityMap.removeChild(renderedCard);
    }
    mapPin.appendChild(mapPinMain);
    mapPin.appendChild(fragmentPins);
  }

  window.renderpins = {
    renderPin: renderPin,
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
