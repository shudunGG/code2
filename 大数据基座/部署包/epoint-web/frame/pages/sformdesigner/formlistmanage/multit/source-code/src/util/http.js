function getCustomData(data) {
  if (data.custom) {
    data = data.custom;
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
  }
  return data;
}

function get(url, noParse, headers) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr);
        if (xhr.status === 200) {
          try {
            resolve(noParse ? xhr.responseText : getCustomData(JSON.parse(xhr.responseText)));
          } catch (error) {
            console.error(error);
            resolve(xhr.responseText);
          }
        } else {
          reject('There was a problem with the request.');
        }
      }
    };
    xhr.open('GET', url);
    if (headers) {
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    xhr.send();
  });
}

function post(url, data = {}, headers) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr);
        if (xhr.status === 200) {
          try {
            resolve(getCustomData(JSON.parse(xhr.responseText)));
          } catch (error) {
            console.error(error);
            resolve(xhr.responseText);
          }
        } else {
          reject({
            state: xhr.status
          });
        }
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    if (headers) {
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
    }

    const params = new URLSearchParams();
    for (let key in data) {
      params.append(key, typeof data[key] == 'object' ? JSON.stringify(data[key]) : data[key]);
    }
    xhr.send(params);
  });
}

export { get, post };
