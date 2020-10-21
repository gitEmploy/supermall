<template>
 <div class="wrapper">
   <div class="content">
     <ul>
       <button @click="btn">按钮</button>
       <li>列表1</li>
       <li>列表2</li>
       <li>列表3</li>
       <li>列表4</li>
       <li>列表5</li>
       <li>列表6</li>
       <li>列表7</li>
       <li>列表8</li>
       <li>列表9</li>
       <li>列表10</li>
       <li>列表11</li>
       <li>列表12</li>
       <li>列表13</li>
       <li>列表14</li>
       <li>列表15</li>
       <li>列表16</li>
       <li>列表17</li>
       <li>列表18</li>
       <li>列表19</li>
       <li>列表20</li>
       <li>列表21</li>
       <li>列表22</li>
       <li>列表23</li>
       <li>列表24</li>
       <li>列表25</li>
       <li>列表26</li>
       <li>列表27</li>
       <li>列表28</li>
       <li>列表29</li>
       <li>列表30</li>
     </ul>
   </div>
 </div>

</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Category",
    data(){
      return {
        scroll: null
      }
    },
    mounted() {
      this.scroll = new BScroll('.wrapper',{
        probeType: 3,
        pullUpLoad: true
      })
      this.scroll.on('scroll',(position) =>{
        console.log(position)
      })
      this.scroll.on('pullingUp',() =>{
        console.log('上拉加载成功')
      })
    },
    methods:{
      btn() {
        console.log('----')
      }
    }
  }
</script>


<style scoped>
.wrapper{
  height: 150px;
  background-color: pink;
  /*overflow-y: scroll;*/
  overflow: hidden;
}
 /*定义滚动条样式*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 10px;
  background-color: rgba(000, 000, 000, 1);
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, .5);
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
  background-color: rgba(240, 240, 240, .5);
}
</style>
