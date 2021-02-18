/***
 *
 * @param urls 请求数组
 * @param limit 最大并发数
 * @param callback 全部完成的回调函数
 */
function maxLimitRequest (urls, limit, callback) {
  let temUrls = urls.slice();
  let len = urls.length;
  let count = 0;
  let result = [];
  let request = url => {
    count ++;
    fetch(url).then(res => {
      let obj = {
        url,
        data: res.json()
      }
      result.push(obj);   //因为请求fetch的先后顺序不能保证，所以使用数据的时候，添加一个url来区别是哪个接口返回的数据
      let nextUrl = temUrls.shift();
      if (nextUrl) {
        request(nextUrl);
      }
      if (count >= len) {
        callback(result);
      }
    }).catch( e => console.log(e));
  }
  for (let i = 0;i < limit;i ++) {
    let url = temUrls.shift();
    request(url);
  }
}

/**
 * 
 * 实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
 * • 要求最大并发数 maxNum
 * • 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * • 所有请求完成后，结果按照 urls 里面的顺序依次打出
 * • 结果通过promise返回出来
 */

function multiRequest(urls = [], maxNum) {
  const len = urls.length;
  const result = new Array(len).fill(false);
  let count = 0;
  return new Promise((resolve, reject) => {
    while (count < maxNum) {
      next();
    }
    function next() {
      let current = count++;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      fetch(url)
        .then((res) => {
          result[current] = res;
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          result[current] = err;
          if (current < len) {
            next();
          }
        });
    }
  });
}