const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => console.log("c"))]);

createFlow([
  () => console.log("a"),
  () => console.log("b"),
  subFlow,
  [() => delay(1000).then(() => console.log("d")), () => console.log("e")],
]).run(() => {
  console.log("done");
});

// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印










// 不使用async/await,借鉴promise的嵌套实现
function createFlow(arr = []) {
  let sources = arr.flat();
  function run(cb) {
    while (sources.length) {
      const task = sources.shift();
      // 把callback放到下一个flow的callback时机里执行
      const next = () => createFlow(sources).run(cb);
      if (typeof task === "function") {
        const res = task();
        if (res?.then) {
          // 如果当前项是promise函数，将接下去的方法next放到promise之后的then中去运行
          res.then(next);
          return;
        }
      } else if (task?.isFlow) {
        // 如果当前项也是一个createFlow返回的对象，将接下去的方法next放到该对象的run方法中运行
        task.run(next);
        return;
      }
    }
    cb?.();
  }
  return {
    run,
    isFlow: true,
  };
}

//使用async/await
const createFlow = (arr) => {
  // 被flat拷贝的那一层数组是浅拷贝，所以这里不需要slice
  const newArr = arr.flat();
  const run = async (cb = () => {}) => {
    for (let i = 0; i < newArr.length; i ++) {
      typeof newArr[i] === 'function' ? await newArr[i]() : await newArr[i].run();
    }
    cb();
  }
  return { run }
};


function createFlow(arr = []) {
  const list = arr.flat();
  function run(cb = () => {}) {
    while (true) {
      const cur = list.shift();
      const next = () => createFlow([...list]).run(cb);
      if (typeof cur === 'function') {
        if ()
      } else if (typeof cur === 'object' && cur !== null) {
        return cur.run(next);
      }
    }
    cb();
  }
  return { run };
}