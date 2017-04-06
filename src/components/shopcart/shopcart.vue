<template>
	<!-- 购物车组件开始 -->
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<!-- 购物车左侧价格 -->
			<div class="content-left">
				<!-- 购物车图标(highlight为激活状态) -->
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
					</div>
					<div class="num"  v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<!-- 购物车图标结束(highlight为激活状态) -->
				<!-- 总价格 -->
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
				<!-- 配送费 -->
				<div class="desc">配送费￥{{deliveryPrice}}元</div>
			</div>
			<!-- 购物车左侧价格结束 -->
			<!-- 购物车右侧结账 -->
			<div class="content-right" @click.stop.prevent="pay">
				<!-- 付款 -->
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
			<!-- 购物车右侧结账结束 -->
		</div>
		<!-- 增加商品数量小球 -->
		<div class="ball-container">
			<!-- 遍历这5个小球 -->
			<div v-for="ball in balls">
				<!-- 动画 -->
				<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
					<div class="ball" v-show="ball.show">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<!-- 增加商品数量小球结束 -->
		<!-- 购物车列表 -->
		<transition name="fold">
		<div class="showcart-list" v-show="listShow">
			<!-- 购物车列表头部 -->
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<!-- 购物车列表头部结束 -->
			<div class="list-content" id="list_content">
				<ul>
					<li class="food" v-for="food in selectFoods">
						<span class="name">{{food.name}}</span>
						<div class="price">
							<span>￥{{food.price*food.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol @add="addFood" :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
		</transition>
		<!-- 购物车列表结束 -->
		<transition name="mask">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
	<!-- 购物车组件结束 -->
</template>

<script type="text/ecmascript-6">
	import BScorll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	export default {
		props: {
			selectFoods: {
				type: Array,
				/* 相当于defaul: function(){},因为在vue里type是个Array或者object，defaul就要是函数,default为默认值 */
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				fold: true,
				dropBalls: []
			};
		},
		computed: {
			/* 计算传过来的商品的总价格 */
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach(function(food) {
					total += food.price * food.count;
				});
				return total;
			},
			/* 计算传过来的商品的总数量 */
			totalCount() {
				let count = 0;
				this.selectFoods.forEach(function(food) {
					count += food.count;
				});
				return count;
			},
			/* 描述右侧‘结算’的不同状态,即内容该表 */
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			/* 描述右侧‘结算’的不同样式,即class样式 */
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(function() {
						if (!this.scroll) {
							this.scroll = new BScorll(document.getElementById('list_content'), {
							click: true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop(el) {
				/* 遍历这个球 */
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					/* 当小球show: false */
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			/* 开始动画:找到所有小球 */
			beforeDrop(el) {
				/* 遍历这些小球 */
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						/* 获取这个点击增加按钮元素相当于窗口的位置 */
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			/* 动画运动过程 */
			dropping(el, done) {
				/* 触发浏览器重绘 */
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
					el.addEventListener('transitionend', done);
				});
			},
			/* 动画结束 */
			afterDrop(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			addFood(target) {
				this.drop(target);
			},
			/* 切换购物车详情 */
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			/* 清空购物车 */
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			/* 隐藏购物车 */
			hideList() {
				this.fold = true;
			},
			/* 确定支付 */
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				window.alert('支付' + this.totalPrice + '元');
			}
		},
		components: {
			'cartcontrol': cartcontrol
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";
	/* 购物车 */
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		/* 内容 */
		.content
			display: flex
			background: #141d27
			font-size: 0
			color: rgba(255, 255, 255, 0.4)
			/* 左侧内容 */
			.content-left
				flex: 1
				/* 购物车图标(highlight为激活状态) */
				.logo-wrapper
					display: inline-block
					vertical-align: top
					position: relative
					top: -10px
					margin: 0 4px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background: #2b343c
						&.highlight
							background: rgb(0, 160, 220)
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
							&.highlight
								color: #fff
					/* 提升商品数量 */
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				/* 价格 */
				.price
					display: inline-block
					vertical-align: top
					margin-top: 12px
					line-height: 24px
					padding-right: 8px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					&.highlight
						color: #fff
				/* 配送费 */
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 8px
					line-height: 24px
					font-size: 10px
			/* 右侧内容 */
			.content-right
				flex: 0 0 95px
				width: 95px
				/* 付款 */
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 500
					/* 不可付款 */
					&.not-enough
						background: #2b333b
					/* 可付款 */
					&.enough
						background: #00b43c
						color: #fff
		/* 小球的样式 */
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
				.inner
					width: 16px
					height: 16px
					border-radius: 50%
					background: rgb(0, 160, 220)
					transition: all 0.4s linear
		.showcart-list
			position: absolute
			left: 0
			top: 0
			z-index: -1
			width: 100%
			transition: all .5s
			transform: translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave
				transform: translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave-active
				transform: translate3d(0, 0, 0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background: #f3f5f7
				border-bottom: 1px solid rgba(7, 17, 27, 0.1)
				border-top: 1px solid rgba(7, 17, 27, 0.1)
				 .title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px
				overflow: hidden
				background: #fff
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20, 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px
		.list-mask
			position: fixed
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -2
			backdrop-filter: blur(10px)
			background: rgba(7, 17, 27, 0.6)
			transition: all .5s
			&.mask-enter-active,&.mask-leave
				opacity: 1
				background: rgba(7, 17, 27, 0.6)
			&.mask-leave-active,&.mask-enter
				opacity: 0
				background: rgba(7, 17, 27, 0)
</style>
