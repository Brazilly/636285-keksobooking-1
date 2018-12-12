'use strict';
(function () {

  // Типы файлов для аплоада
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var typeForm = document.querySelector('#type');
  var priceForm = document.querySelector('#price');
  var roomNumber = document.querySelector('#room_number');
  var guestsCapacity = document.querySelector('#capacity');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var form = document.querySelector('.ad-form');
  var main = document.querySelector('main');
  var mapFileChooser = document.querySelector('#avatar');
  var preview = document.querySelector('.ad-form__user-pic');
  var placeFileChooser = document.querySelector('#images');
  var placeImages = document.querySelector('.ad-form__photo');

  var typeFormToPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };

  var roomNumberToGuestsCapacity = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };

  var guestsCapacityToRoomNumber = {
    '1': '1',
    '2': '2',
    '3': '3',
    '0': '100'
  };

  // Соответствие типов жилищ с ценами
  typeForm.addEventListener('change', function () {
    priceForm.min = typeFormToPrice[typeForm.value];
    priceForm.placeholder = typeFormToPrice[typeForm.value];
  });

  // Соответствие количества комнат количеству гостей
  roomNumber.addEventListener('change', function () {
    var options = guestsCapacity.querySelectorAll('option');
    guestsCapacity.value = roomNumberToGuestsCapacity[roomNumber.value];
    [].forEach.call(options, function (item) {
      item.disabled = '';
    });
    switch (roomNumber.value) {
      case '1':
        options[1].disabled = 'disabled';
        options[2].disabled = 'disabled';
        options[3].disabled = 'disabled';
        break;
      case '2':
        options[2].disabled = 'disabled';
        options[3].disabled = 'disabled';
        break;
      case '3':
        options[3].disabled = 'disabled';
        break;
    }
  });

  // Соответствие количества гостей количеству комнат
  guestsCapacity.addEventListener('change', function () {
    roomNumber.value = guestsCapacityToRoomNumber[guestsCapacity.value];
  });

  // Соответствие времени заезда с временем выезда
  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  // Соответствие времени выезда с временем заезда
  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  // Обработчик отправки формы
  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), function () {
      var elementSuccess = successTemplate.cloneNode(true);
      main.appendChild(elementSuccess);
    }, function (errorMessage) {
      window.renderPins.errorHandler(errorMessage);
    });
    window.cityMap.restartPage();
    document.addEventListener('click', window.cityMap.onDocumentClick);
    evt.preventDefault();
  });

  // Аплоад аватарки
  mapFileChooser.addEventListener('change', function () {
    var file = mapFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  // Аплоад изображений
  placeFileChooser.addEventListener('change', function () {
    var file = placeFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var elementImg = document.createElement('img');
        elementImg.classList.add('ad-form__photo-preview');
        placeImages.appendChild(elementImg);
        elementImg.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

})();
