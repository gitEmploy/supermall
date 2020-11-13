import Vue from 'vue'
import Vuex from 'vuex'


// 1.安装插件

Vue.use(Vuex)

// 2.创建store对象

const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addVCounter (state,payload){
      payload.count++
    },
    addToCart(state,payload) {
      state.cartList.push(payload)
    }
  },
  actions: {
    addCart(context,payload){
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      console.log(oldProduct)
      if(oldProduct){
        context.commit('addVCounter',oldProduct)
      }else{
        payload.count = 1
        // state.cartList.push(payload)
        context.commit('addToCart',payload)
      }
    }
  }
})

// 3.挂载Vue实例上

export default store;
