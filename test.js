// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
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

function createFlow(lists = []) {
  let effects = [...lists].flat()
  async function run(callback) {
    for (let i = 0; i < effects.length; i++) {
      typeof effects[i] == 'function' ? await effects[i]() : await effects[i].run()
    }
    callback?.();
  }
  return {
    run
  }
}

/*
function createFlow(lists = []) {
  let effects = lists.slice().flat()
  function run(callback) {
    while (effects.length) {
      const task = effects.shift()

      const next = () => createFlow(effects).run(callback)
      if (typeof task === 'function') {
        const res = task();
        if (res instanceof Promise) {
          res.then(next);
          return
        }
      } else if (task?.flag) {
        task.run(next)
        return
      }
    }
    callback?.()
  }
  return {
    run,
    flag: true
  }
}*/
