function _Promise(fn) {
  const self = this;
  self.onResolvedList = [];
  const resolve = (value) => {
    setTimeout(() => {
      self.data = value;
      self.onResolvedList.forEach(callback => callback());
    });
  };
  fn(resolve);
}

_Promise.prototype.then = function(onResolved) {
  const self = this;
  return new _Promise(resolve => {
    self.onResolvedList.push(() => {
      const result = onResolved(self.data);
      if (result instanceof _Promise) {
        result.then(resolve);
      } else {
        resolve(result);
      }
    });
  });
};

Promise.prototype.all = (list) => {
  return new Promise((resolve, reject) => {
    const len = list.length;
    if (len === 0) {
      resolve([]);
    } else {
      const result = [];
      let index = 0;
      for (let i = 0; i < len; i ++) {
        Promise.resolve(list[i]).then(res =>  {
          result[i] = res;
          index++;
          if (index === len) return resolve(result);
        }).catch(err => {
          return reject(err);
        });
      }
    }
  });
};


new _Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 500)
}).then(res => {
  console.log(res)
  return new _Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    }, 500)
  })
}).then(console.log)