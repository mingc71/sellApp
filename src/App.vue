<template>
  <div>
    <!-- 导入header模板,可以通过v-bind:seller="seller"将数据传入到header组件 -->
    <v-header :seller="seller"></v-header>
    <!-- 中间的导航栏 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 中间的导航栏结束 -->
    <!-- 一个路由外链 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';
  /* 导入util中的urlParse */
  import {urlParse} from 'common/js/util';
  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            /* console.log(queryParam); */
            return queryParam.id;
          })()
        }
      };
    },
    /* 模板加载完成后再执行 */
    created() {
      /* this指的是就vue,则this.$http.get('/api/seller')拿到数据 */
      this.$http.get('/api/seller?id=' + this.seller.id).then(function(res) {
        /* 请求成功时函数 */
        res = res.body;
        if (res.errno === ERR_OK) {
          /* Object.assign扩展属性 */
          this.seller = Object.assign({}, this.seller, res.data);
        }
      }, function() {
        /* 请求失败时函数 */
        alert('获取数据失败');
      });
    },
    /* 当导入一个组件时,需要配置一下才能使用 */
    components: {
      'v-header': header
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl";
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center;
      & > a
        display: block
        font-size: 14px
        &.router-link-active
          color: rgb(240,20,20)

</style>
