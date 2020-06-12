/***
 *
 * @param urls 请求数组
 * @param limit 最大并发数
 * @param callback 全部完成的回调函数
 */
function maxLimitRequest (urls, limit, callback) {
  let temUrls = urls.splice()
  let len = urls.length
  let count = 0
  let result = []
  let request = url => {
    count ++
    fetch(url).then(res => {
      result.push(res.json())
      let nextUrl = temUrls.shift()
      if (nextUrl) {
        request(nextUrl)
      }
      if (count >= len) {
        callback(result)
      }
    }).catch( e => console.log(e))
  }
  for (let i = 0;i < limit;i ++) {
    let url = temUrls.shift()
    request(url)
  }
}