function htmlEncode(html) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(html));
  return div.innerHTML;
}

function htmlDecode(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.innerText;
}

export { htmlEncode, htmlDecode };
