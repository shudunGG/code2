// 用于简单解析 a.b.c 这种属性获取和涉资

/**
 * 给一个对象的 a.b.c 的嵌套属性进行设置
 *
 * @param {object} obj 目标obj
 * @param {string} dotProp 操作属性
 * @returns 获取到的值
 */
function getDotProp(obj, dotProp) {
  const propArr = dotProp.split('.');
  // 不含 . 则为直接获取
  if (propArr.length === 1) {
    return obj[dotProp];
  }
  let i = 0;
  let target = obj,
    len = propArr.length,
    temp;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 命中到最后 结束
    if (i == len - 1) {
      return target[propArr[i]];
    }

    temp = target[propArr[i]];
    if (temp && typeof temp == 'object') {
      target = temp;
      i++;
    } else {
      console.error('无法获取嵌套属性 at ' + propArr[i], obj, dotProp);
      return null;
    }
  }
}

/**
 * 给一个对象的 a.b.c 的嵌套属性进行设置
 *
 * @param {object} obj 目标obj
 * @param {string} dotProp 操作属性
 * @param {any} value 要设置的属性
 * @returns 设置之后的值
 */
function setDotProp(obj, dotProp, value) {
  const propArr = dotProp.split('.');
  // 不含 . 则直接设置
  if (propArr.length === 1) {
    return (obj[dotProp] = value);
  }
  let i = 0;
  let target = obj,
    len = propArr.length - 1,
    temp;

  do {
    temp = target[propArr[i]];
    if (temp && typeof temp == 'object') {
      target = temp;
    } else {
      console.error('无法设置嵌套属性 at ' + propArr[i], obj, dotProp);
    }
    i++;
  } while (i < len);

  if (!target.hasOwnProperty(propArr[i])) {
    console.warn('设置原来没有的属性：' + propArr[i] + ' at ', target);
  }

  return (target[propArr[i]] = value);
}

// const testObj = { a: { b: { c: 1 } } };

// console.log('get a.b.c', getDotProp(testObj, 'a.b.c'));
// console.log('set a.b.c = 12', setDotProp(testObj, 'a.b.c', 12));

// console.log(testObj);

export { getDotProp, setDotProp };
export const dotProp = {
  getDotProp,
  setDotProp
};
