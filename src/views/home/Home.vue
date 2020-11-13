<template>
    <div id="home">
      <nav-bar class="home-nav">
        <div slot="center">购物街</div>
      </nav-bar>
      <Tab-Control
        :titles="['流行','新款','精选']"
        @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed">
      </Tab-Control>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
          <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
          <recommend-view :recommends="recommends"></recommend-view>
          <feature-view></feature-view>
          <Tab-Control
            :titles="['流行','新款','精选']"
            @tabClick="tabClick" ref="tabControl2">
          </Tab-Control>
          <goods-list :goods="showGoods"></goods-list>
        </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {itemListenerMixin,backTopMixin} from "common/mixin";


  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins: [itemListenerMixin,backTopMixin],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{
            page:0,
            list:[]
          },
          'new':{
            page:0,
            list:[]
          },
          'sell':{
            page:0,
            list:[]
          }
        },
        currentType:'pop',
        //tab-control的偏移量
        tabOffsetTop:0,
        // tab-control的是否吸顶默认不吸顶
        isTabFixed:false,
        // 解决离开时记录状态和保存目前的位置
        saveY:0
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0,this.saveY,0)
    },
    deactivated() {
      // 1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      console.log('home created')
    },
    mounted() {

    },
    destroyed() {
      console.log('home destroyed')
    },
    methods: {
      /**
       * 点击返回顶部的功能
       */
      backClick() {
       this.$refs.scroll.scrollTo(0,0,500)
      },
      contentScroll(position) {
        // console.log((-position.y) >1000)
        // 1.判断backtop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop


      },
      /**
       * 上拉加载更多内容
       */
      loadMore() {
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.finishPullUp()
      },
      /**
       * 事件监听的相关方法
      */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType ='new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      /**
       * 网络请求相关的方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
          // console.log(res)
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res =>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // this.$refs.scroll.finishPullUp();
        })
      },

      swiperImageLoad(){
        // 1.轮播图图片加载完成的事件监听
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 10;
  }
  .content{
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
  }
  /*另外一种实现滚动在中间的方法*/
  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>
