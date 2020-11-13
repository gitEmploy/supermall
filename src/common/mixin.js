import {debounce} from './utils'
import BackTop from "components/content/BackTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      // 全局的bus的itemImageLoad
      itemImgListener: null
    }
  },
  mounted() {
    // 对这个函数进行防抖操作
    const refresh = debounce(this.$refs.scroll.refresh,200)

    // 对监听的事件进行保存
    this.itemImgListener = () =>{
      refresh()
    }
    // 监听item中图片加载完成
    this.$bus.$on('itemImageLoad',this.itemImgListener)
  },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      // 是否显示或者隐藏返回顶部的按钮
      isShowBackTop:false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0,500)
    }
  }

}
