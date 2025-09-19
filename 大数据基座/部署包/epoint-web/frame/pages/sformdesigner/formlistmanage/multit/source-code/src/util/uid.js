// var uuid = (function() {
//   var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
//   return function uuid(len, radix) {
//     var chars = CHARS,
//       uuid = [],
//       i;
//     radix = radix || chars.length;

//     if (len) {
//       for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
//     } else {
//       var r;

//       uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
//       uuid[14] = '4';

//       for (i = 0; i < 36; i++) {
//         if (!uuid[i]) {
//           r = 0 | (Math.random() * 16);
//           uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
//         }
//       }
//     }

//     return uuid.join('');
//   };
// })();

function uid() {
  // 时间戳
  var d = +new Date();
  // 随机数 * 1000000000 用于替换 时间戳前面固定的部分
  var r = ((Math.random() * 10000) >>> 0) * 1000000000;
  // toString 32 转化为长度较短的字符串
  const id = (r + d).toString(32);
  // 如果存在了 就重新生成一次
  if (uid._store[id]) {
    console.log('id duplicated, retry!', id);
    return uid();
  }
  uid._store[id] = true;
  return id;
}
// 缓存所有生成过的id
uid._store = {};
// 针对历史数据的适配处理
uid.adapt = function(arr, getId = item => item.id) {
  const store = uid._store;
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      const id = getId(item);
      if (!store[id]) {
        store[id] = id;
      } else {
        console.warn('id duplicated', item.id);
      }
    });
  }
};

// function test(fn1, fn2) {
//   let i = 0;
//   let t1 = performance.now();
//   while (i++ < 100000) {
//     fn1();
//   }
//   console.log(fn1.name, performance.now() - t1);

//   let j = 0;
//   let t2 = performance.now();
//   while (j++ < 100000) {
//     fn2();
//   }
//   console.log(fn2.name, performance.now() - t2);
// }

// test(uuid, uid);
// test(uuid, uid);
// test(uuid, uid);
// test(uuid, uid);
// test(uuid, uid);
// test(uuid, uid);

export default uid;
