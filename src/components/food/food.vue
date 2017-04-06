<template>
	<transition name="move">
		<!-- 商品详细页 -->
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<!-- 展示图 -->
				<div class="image-header">
					<img :src="food.image" :alt="food.name">
					<!-- 返回商品列表按钮 -->
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
					<!-- 返回商品列表按钮 -->
				</div>
				<!-- 展示图结束 -->
				<!-- 内容 -->
				<div class="content">
					<!-- 标题 -->
					<h1 class="title">{{food.name}}</h1>
					<!-- 标题结束 -->
					<!-- 详情信息 -->
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<!-- 详情信息结束 -->
					<!-- 价格 -->
					<div class="price">
						<!-- 现价 -->
						<span class="now">
							￥{{food.price}}
						</span>
						<!-- 原价 -->
						<span class="old" v-show="food.oldPrice">
							￥{{food.oldPrice}}
						</span>
					</div>
					<!-- 数量控制组件 -->
					<div class="cartcontrol-wrapper">
						<cartcontrol @add="addFood" :food="food"></cartcontrol>
					</div>
					<!-- 数量控制组件结束 -->
					<!-- 第一次加入购物车 -->
					<transition name="fade">
						<div class="buy" @click="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
					</transition>
					<!-- 第一次加入购物车结束 -->
				</div>
				<!-- 内容结束 -->
				<!-- 分割线 -->
				<split v-show="food.info"></split>
				<!-- 分割线结束 -->
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<!-- 分割线 -->
				<split></split>
				<!-- 分割线结束 -->
				<!-- 评价 -->
				<div class="rating">
					<!-- 评价头部 -->
					<h1 class="title">商品评价</h1>
					<!-- 评价头部结束 -->
					<!-- 评价选择组件 -->
					<ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
					<!-- 评价选择组件结束 -->
					<!-- 评价列表 -->
					<div class="rating-wrapper">
						<!-- 有评价内容 -->
						<ul v-show="food.ratings && food.ratings.length">
							<!-- 遍历评价 -->
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
								<!-- 评价用户信息 -->
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" width="12" height="12" alt="rating.username">
								</div>
								<!-- 评价用户信息结束 -->
								<!-- 时间 -->
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<!-- 时间结束 -->
								<!-- 评论的文字 -->
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
									{{rating.text}}
								</p>
								<!-- 评论的文字结束 -->
							</li>
							<!-- 遍历评价结束 -->
						</ul>
						<!-- 有评价内容结束 -->
						<!-- 无评价内容 -->
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
						<!-- 无评价内容结束 -->
					</div>
					<!-- 评价列表结束 -->
				</div>
				<!-- 评价结束 -->
			</div>
		</div>
		<!-- 商品详细页结束 -->
	</transition>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import Vue from 'vue';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import split from 'components/split/split';
	import ratingselect from 'components/ratingselect/ratingselect';
	/* 引入data.js，{formatDate}带花括号一般是引入的export function，所有才带有花括号，则可以引入多个function，例如{a,b,c} */
	import {formatDate} from 'common/js/date';

	// const POSITIVE = 0;/* 满意 */
	// const NEGATIVE = 1;/* 不满意 */
	const ALL = 2; /* 所有 */
	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				/* 控制food组件是否出现 */
				showFlag: false,
				/* 控制评论出现的类型（全部、满意、吐槽） */
				selectType: ALL,
				/* 控制有文字的评级是否出现 */
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		methods: {
			/* food商品详情页显示（父组件调用） */
			show() {
				/* food详情页出现 */
				this.showFlag = true;
				/* 评价展示全部 */
				this.selectType = ALL;
				this.onlyContent = true;
				this.$nextTick(function() {
					/* 因为不像列表页，要反复进入，所以要重新计算 */
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, { click: true });
					} else {
						/* 重新做一次计算 */
						this.scroll.refresh();
					}
				});
			},
			/* food商品详情页隐藏 */
			hide() {
				this.showFlag = false;
			},
			/* 点击加入购物车 */
			addFirst(event) {
				if (!event._constructed) {
					return;
				}
				this.$emit('add', event.target);
				/* 设置count */
				Vue.set(this.food, 'count', 1);
			},
			addFood(target) {
				this.$emit('add', target);
			},
			/* ratingselect组件发布的方法（选择全部、满意、吐槽） */
			selectRating(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			/* ratingselect组件发布的方法（选择是否全部内容） */
			toggleContent() {
				this.onlyContent = !this.onlyContent;
				this.$nextTick(function() {
					this.scroll.refresh();
				});
			},
			/* 根据ratingselec子组件传来的数据，改变评价列表出现的内容 */
			needShow(type, text) {
				/* 判断是否出现有文字的评价内容 */
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					/* 出现全部评价内容 */
					return true;
				} else {
					/* 出现满意或者吐槽的评价内容 */
					return type === this.selectType;
				}
			}
		},
		/* 过滤器 */
		filters: {
			/* 对时间的过滤 */
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	/* 商品详情页 */
	.food
		position: fixed
		left: 0
		top: 0
		bottom: 48px
		z-index: 30
		width: 100%
		background: #fff
		transition: all 0.2s linear
		/* 详细页出现和消失动画 */
		&.move-enter-active,&.move-leave
			transform: translate3d(0, 0, 0)
		&.move-enter, &.move-leave-active
			transform: translate3d(100%, 0, 0)
		.image-header
			position: relative
			width: 100%
			height: 0
			padding-top: 100%
			img
				position: absolute
				top: 0
				left: 0
				width: 100%
				height: 100%
			/* 退出按钮样式 */
			.back
				position: absolute
				top: 10px
				left: 0
				background: #ccc
				.icon-arrow_lift
					display: block
					padding: 4px
					font-size: 15px
					color: #fff
		.content
			position: relative
			padding: 18px
			/* 标题 */
			.title
				line-height: 14px
				margin-bottom: 8px
				font-size: 14px
				font-weight: 700
				color: rgb(7, 17, 27)
			/* 详细情况 */
			.detail
				margin-bottom: 18px
				line-height: 10px
				height: 10px
				font-size: 0
				.sell-count, .rating
					font-size: 10px
					color: rgb(147, 153, 159)
				.sell-count
					margin-right: 12px
			/* 价格 */
			.price
				font-weight: 700
				line-height: 24px
				 .now
					margin-right: 8px
					font-size: 14px
					font-weight: 700
					color: rgb(240, 20, 20)
				.old
					text-decoration: line-through
					font-size: 10px
					color: rgb(147, 153, 159)
			/* 数量控制组件 */
			.cartcontrol-wrapper
				position: absolute
				right: 12px
				bottom: 12px		
			/* 第一次加入购物车 */	
			.buy
				position: absolute
				right: 18px
				bottom: 18px
				z-index: 10
				height: 24px
				line-height: 24px
				padding: 0 12px
				box-sizing: border-box
				border-radius: 12px
				font-size: 10px
				color: #fff
				background: rgb(0, 160, 220)
				transition: all 0.4s
				&.fade-enter-active,&.fade-leave
					opacity: 1
				&.fade-enter, &.fade-leave-active
					opacity: 0
		 .info
			padding: 18px
			.title
				line-height: 14px
				margin-bottom: 6px
				font-size: 14px
				color: rgb(7, 17, 27)
			.text
				line-height: 24px
				padding: 0 8px
				font-size: 12px
				color: rgb(77, 85, 93)
		/* 评价 */
		.rating
			padding-top: 18px
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7, 17, 27)
			.rating-wrapper
				padding: 0 18px
				.rating-item
					position: relative
					padding: 16px 0
					border-1px(rgba(7, 17, 27, 0.1))
					.user
						position: absolute
						right: 0
						top: 16px
						line-height: 12px
						font-size: 0
						.name
							display: inline-block
							margin-right: 6px
							vertical-align: top
							font-size: 10px
							color: rgb(147, 153, 159)
						.avatar
							border-radius: 50%
					.time
						margin-bottom: 6px
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27)
						.icon-thumb_up, .icon-thumb_down
							margin-right: 4px
							line-height: 16px
							font-size: 12px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.icon-thumb_down
							color: rgb(147, 153, 159)
				.no-rating
					padding: 16px 0
					font-size: 12px
					color: rgb(147, 153, 159)
</style>
