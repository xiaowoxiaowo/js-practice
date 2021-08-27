function createStore(reducer, initState, enhancer) {
  let state = initState;
	let listenters = [];
	let isDispatching = false;

	if (typeof enhancer !== 'undefined') {
		return enhancer(createStore)(reducer, initState);
	}

  return {
    getState() {
      return state;
    },
    dispatch(action) {
			if (isDispatching) {
				throw new Error('reducer里不能再嵌套dispatch')
			}
			try {
				isDispatching = true
				state = reducer(state, action)
			} finally {
				isDispatching = false
			}
      listenters.forEach(listenter => listenter());
    },
    subscribe(listenter) {
      listenters.push(listenter);
		},
		unSubscribe(listenter) {
			const index = listenters.indexOf(listenter);
			if (index > -1) listenters.splice(index, 1);
		},

  }
}

function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error('dispatch没有被改写');
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
		};
		
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
		dispatch = compose(...chain)(store.dispatch);
		
    return {
      ...store,
      dispatch
    }
  }
}

function counter(state = 10, action) {
  switch (action.type) {
    case '+':
      return state + action.val
    case '-':
      return state - action.val
    default:
      return state
  }
}

let store = createStore(counter)

store.subscribe(() => console.log(store.getState()))

store.dispatch({type: '+', val: 10})
store.dispatch({type: '-', val: 10})
