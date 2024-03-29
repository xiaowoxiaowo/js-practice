function _Promise(fn) {
  const self = this;
  this.cbList = [];
  function resolved(data) {
    self.cbList.forEach(fn => fn(data));
  }
  fn(resolved);
}

_Promise.prototype.then = function(Resolved) {
  const self = this;
  return new _Promise((resolved) => {
    self.cbList.push((data) => {
      const result = Resolved(data);
      if (result instanceof _Promise) {
        result.then(resolved);
      } else {
        resolved(result);
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
