class PubSub
{
    constructor() {
        // 维护所有时间以及订阅行为
        this.events = {};
    }
    /**
     * 订阅事件
     */
    subscribe( event, fn ) {
        if ( !this.events[event] ) {
            this.events[event] = [];
        }
        // 将回调放入该事件下等待被触发
        this.events[event].push(fn);
    }
    /**
     * 发布事件
     */
    publish( event, ...args ) {
        if (this.events[event] ) { // 如果事件已经注册
            // 调用事件的所有订阅行为并传入相应参数
            this.events[event].forEach( fn => fn(...args) )
        }
    }
    /**
     * 移除某个事件的一个订阅行为
     */
    unsubscribe( event, fn ) {
        if (this.events[event]) {
            // 找到该事件订阅函数的下标位置
            const targetIndex = this.events[event].findIndex(item => item === fn) 
            // findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
            // 当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，
            //之后的值不会再调用执行函数。
            // 如果没有符合条件的元素返回 -1

            // 删除该事件下指定的订阅行为
            if (targetIndex !== -1) {
                this.events[event].splice(targetIndex, 1)
            }
            // 该事件下无订阅行为时直接删除该订阅事件
            if (this.events[event].length === 0) {
                delete this.events[event]
            }
        }
    }
    /**
     * 移除某个事件的所有订阅行为
     * @param {string} event 事件名称
     */
    unsubscribeAll(event) {
        if (this.events[event]) {
            delete this.events[event]
        }
    }

}