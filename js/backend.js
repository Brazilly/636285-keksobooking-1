'use strict';
(function () {

  var TIMEOUT = 10000; // 10s

  var SERVER_STATUS_OK = 200;

  // Функция получения данных с сервера
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    var URL = 'https://js.dump.academy/keksobooking/data';

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SERVER_STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки данных: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };

  // Функция отправки данных на сервер
  var upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    var URL = 'https://js.dump.academy/keksobooking';

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SERVER_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Ошибка загрузки объявления: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
