<template>
  <!-- 头部开始 -->
  <div class="header">
    <div class="content-wrapper">
      <!-- 左边头像 -->
      <div class="avatar">
        <img v-bind:src="seller.avatar" alt="" width="64" height="64"/>
      </div>
      <!-- 左边头像结束 -->
      <!-- 右边内容 -->
      <div class="content">
        <!-- 产品名 -->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <!-- 产品名结束 -->
        <!-- 快递详情 -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 快递详情结束 -->
        <!-- 店家活动 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" v-bind:class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <!-- 店家活动结束 -->
      </div>
      <!-- 右边内容结束 -->
      <!-- 店家活动个数 -->
    	<div v-if="seller.supports" class="support-count" @click="showDetail()">
    		<span class="count">{{seller.supports.length}}个</span>
    		<i class="icon-keyboard_arrow_right"></i>
    	</div>
      <!-- 店家活动个数结束 -->
    </div>
    <!-- 公告栏 -->
    <div class="bulletin-wrapper" @click="showDetail()">
    	<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    	<i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 公告栏结束 -->
    <!-- header背景 -->
    <div class="background">
      <img v-bind:src="seller.avatar" width="100%" height="100%"/>
    </div>
    <!-- header背景结束 -->
  	<!--蒙板-->
    <transition name="slide-fade">
    	<div  class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
        	<div class="detail-main">
        		<h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="supports-item" v-for="(item, $index) in seller.supports">
                <!-- classMap[seller.supports[$index].type]判断出现的小图标 -->
                <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                <span class="text">{{seller.supports[$index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
        	</div>
        </div>
        <div class="detail-close" @click="hideDetail">
        	<i class="icon-close"></i>
        </div>
    	</div>
    </transition>
    <!-- 蒙板结束 -->
  <!-- 头部开始结束 --> 
  </div>
</template>

<script type="text/ecmascript-6">
  /* 导入一个评星组件 */
  import star from 'components/star/star';
  export default {
    /* props可以接收从外部组件传入的数据 */
    props: {
      seller: {
        /* 需要定义传入数据的类型 */
        type: Object
      }
    },
    data() {
      /* retrun的数据可以在vue里通过this.**调用 */
      return {
        /* 规定蒙版的显示与否 */
        detailShow: false
      };
    },
    methods: {
      /* 蒙版显示 */
      showDetail() {
        this.detailShow = true;
      },
      /* 蒙版消失 */
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      /* 设置一个数组来规定图标的名字 */
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/icon.css"
  @import "../../common/stylus/base.styl"
  /* header样式开始 */
  .header
    color: #fff
    overflow: hidden
    position: relative
    background: rgba(7,17,27,0.5)
    .content-wrapper
      padding: 24px 12px 18px 24px
      position: relative
      font-size: 0
      /* 左边头像 */
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      /* 右边内容 */
      .content
        display: inline-block
        margin-left: 16px
        font-size: 14px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            vertical-align: bottom
            width: 12px
            height: 12px
            margin-left: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height: 12px
            font-size: 10px
      /* 店家活动个数 */
      .support-count
      	position: absolute
      	right: 12px
      	bottom: 18px
      	padding: 0 8px
      	height: 24px
      	line-height: 24px
      	border-radius: 14px
      	background: rgba(0,0,0,0.2)
      	text-align: center
      	.count
      		font-size: 10px
      	.icon-keyboard_arrow_right
      		line-height: 24px
      		margin-left: 2px
      		font-size: 10px
    /* 公告栏 */
    .bulletin-wrapper
    	position: relative
    	height: 28px
    	line-height: 28px
    	padding: 0 22px 0 12px
    	white-space: nowrap
    	overflow: hidden
    	text-overflow: ellipsis
    	background: rgba(7,17,27,0.2)
    	.bulletin-title
    		display: inline-block
    		vertical-align: top
    		width: 22px
    		height: 12px
    		margin-top: 8px
    		bg-image('bulletin')
    		background-size: 22px 12px
    		background-repeat: no-repeat
    	.bulletin-text
    		margin: 0 4px
    		vertical-align: top
    		font-size: 10px
    	.icon-keyboard_arrow_right
    		position: absolute
    		font-size: 10px
    		right: 12px
    		top: 8px
    /* header背景 */
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)  
    /* 蒙板 */
    .detail
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      background: rgba(7,17,27,0.8)
      backdrop-filter: blur(10px)
  		.detail-wrapper
        width: 100%
        min-height: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255,255,255,0.2)
            .text
              padding: 0 12px
              font-weight: 700
              font-size: 14px
          .supports
            width: 80%
            margin: 0 auto
            .supports-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
  		.detail-close
  			position: relative
  			width: 32px
  			height: 32px
  			margin: -64px auto
  			clear: both
  			font-size: 32px
  
  /* 蒙版出现动画 */
  .slide-fade-enter-active {
    transition: all .5s;
  }
  .slide-fade-leave-active {
    transition: all .5s;
  }
  .slide-fade-enter, .slide-fade-leave-active {
          background: rgba(7,17,27,0.0);
          opacity: 0;
  }
</style>
