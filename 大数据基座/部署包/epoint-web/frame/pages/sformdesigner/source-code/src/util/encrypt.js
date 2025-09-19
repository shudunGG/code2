function encrypt(str) {
  return window.encodeURIComponent(window.btoa(window.encodeURIComponent(str)));
}

function decrypt(str) {
  return window.decodeURIComponent(window.atob(window.decodeURIComponent(str)));
}

export { encrypt, decrypt };

export default { encrypt, decrypt };
