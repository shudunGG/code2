import uid from './uid.js';
import { getDotProp, setDotProp } from './dotprop.js';
import copy from './copy.js';
import { get, post } from './http.js';
import { htmlEncode, htmlDecode } from './html';
import { controlAutoIndex, colAutoIndex, rowAutoIndex } from './autoIndex';
import { encrypt, decrypt } from './encrypt';
import clamp from './clamp.js';

export { uid, getDotProp, setDotProp, copy, get, post, htmlEncode, htmlDecode, clamp, controlAutoIndex, colAutoIndex, rowAutoIndex, encrypt, decrypt };

export const Util = {
  uid,
  getDotProp,
  setDotProp,
  copy,
  get,
  post,
  htmlEncode,
  htmlDecode,
  clamp,
  controlAutoIndex,
  colAutoIndex,
  encrypt,
  decrypt
};
