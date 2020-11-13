<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll class="content" ref="scroll"
            :probeType="3"
            @scroll="contentScroll">
      <div v-for="(item, index) in this.$store.state">{{item}}</div>

      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <detail-title ref="detailTitle"></detail-title>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar  @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailTitle from "./childComps/DetailTitle";
  import DetailBottomBar from "./childComps/DetailBottomBar";


  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,getRecommend,Goods,shop,GoodsParam} from "network/detail";
  import {debounce,itemListenerMixin,backTopMixin} from "common/mixin";

  export default {
    name: "detail",
    mixins: [itemListenerMixin,backTopMixin],
    data(){
      return {
        iid: null,
        topImages: [itemListenerMixin],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopY: [],
        currentIndex: 0
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailTitle,
      DetailBottomBar,
      GoodsList,
      Scroll
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid
      // 2.根据iid请求详情页数据
      getDetail(this.iid).then(res =>{
        let data = res.result
        // 1.详情页顶部的图片轮播图
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        // 3.创建店铺信息的对象
        this.shop = new shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        // 6.评论信息
        if(data.rate.cRate !==0){
          this.commentInfo = data.rate.list[0]
        }

        this.$nextTick(() =>{
          // 这个函数根据最新的数据，对应的DOM是已经渲染出来
          // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片的)
          // offset值拿到不对的时候,都是因为图片的原因
        })
      })

      // 3.请求推荐数据
      getRecommend().then(res =>{
        this.recommends = res.data.list
      })
    },
    mounted() {

    },
    updated() {
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.themeTopY = []
        this.themeTopY.push(0)
        this.themeTopY.push(this.$refs.params.$el.offsetTop)
        this.themeTopY.push(this.$refs.comment.$el.offsetTop)
        this.themeTopY.push(this.$refs.detailTitle.$el.offsetTop)
        this.themeTopY.push(Number.MAX_VALUE)
        // console.log(this.themeTopY)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopY[index])
      },
      contentScroll(position){
        // 1.获取y值
        const positionY = -(position.y)
        // 2.positionY和主题中进行对比
        let length = this.themeTopY.length -1
        for(let i = 0; i < length; i++){
          if(this.currentIndex !== i && positionY > this.themeTopY[i] && positionY < this.themeTopY[i+1]){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 3.是否显示回到顶部按钮
        this.isShowBackTop = (-position.y) > 1000
      },
      // 4.是否返回到顶部
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500)
      },
      // 购物车添加商品的功能
      addToCart() {
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 1.将商品添加到Vuex里面保存
          this.$store.dispatch('addCart',product)
      }
    }
  }
</script>

<style scoped>

  .content {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    height: calc(100% - 44px - 49px);
  }
  #detail{
    position: relative;
    z-index: 10;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 10;
    background-color: #ffffff;
  }
</style>
