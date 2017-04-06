<template>
	<!-- 评价页面 -->
	<div class="ratings" ref="ratings">
		<!-- 内容 -->
		<div class="ratings-content">
			<!-- 综合评分(头部) -->
			<div class="overview">
				<!-- 评分左边(大评分) -->
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<!-- 评分左边(大评分)结束 -->
				<!-- 评分右边(两种评分、送到时间) -->
				<div class="overview-right">
					<!-- 服务态度评分(样式相同) -->
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<!-- 评分星星组件的引入 -->
						<star :size="36" :score="seller.serviceScore"></star>
						<!-- 评分星星组件的引入结束 -->
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<!-- 服务态度评分(样式相同)结束 -->
					<!-- 商品评分(样式相同) -->
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<!-- 评分星星组件的引入 -->
						<star :size="36" :score="seller.foodScore"></star>
						<!-- 评分星星组件的引入结束 -->
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<!-- 商品评分(样式相同)结束 -->
					<!-- 送达时间(分钟) -->
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
					<!-- 送达时间(分钟)结束 -->
				</div>
				<!-- 评分右边(两种评分、送到时间)结束 -->
			</div>
			<!-- 综合评分(头部)结束 -->
			<!-- 分隔线 -->
			<split></split>
			<!-- 分隔线结束 -->
			<!-- 评价选中组件 -->
			<ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent"  :ratings="ratings"></ratingselect>
			<!-- 评价选中组件结束 -->
			<!-- 评论内容 -->
				<div class="rating-wrapper">
					<ul>
						<li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
							<!-- 头像 -->
							<div class="avatar">
								<img width="28" height="28" :src="rating.avatar">
							</div>
							<!-- 头像结束 -->
							<div class="content">
								<!-- 用户名 -->
								<h1 class="name">{{rating.username}}</h1>
								<!-- 用户名结束 -->
								<!-- 用户评价 -->
								<div class="star-wrapper">
									<!-- 给出的分数 -->
									<star :size="24" :score="rating.score"></star>
									<!-- 送到时间 -->
									<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
								</div>
								<!-- 用户评价结束 -->
								<!-- 评价的文字内容 -->
								<p class="text">{{rating.text}}</p>
								<!-- 评价的文字内容结束 -->
								<div class="recommend" v-show="rating.recommend && rating.recommend.length">
									<span class="icon-thumb_up"></span>
									<span class="item" v-for="item in rating.recommend">{{item}}</span>
								</div>
								<!-- 评论时间 -->
								<div class="time">
									{{rating.rateTime | formatDate}}
								</div>
								<!-- 评论时间结束 -->
							</div>
						</li>
					</ul>
				</div>
			<!-- 评论内容结束 -->
		</div>
		<!-- 内容 -->
	</div>
	<!-- 评价页面结束 -->
</template>

<script type="text/ecmascript-6">
	/* 评分星星组件的引入 */
	import star from 'components/star/star';
	/* 分割线组件 */
	import split from 'components/split/split';
	/* 评价选中组件 */
	import ratingselect from 'components/ratingselect/ratingselect';
	/* 滚动组件 */
	import BScroll from 'better-scroll';
	/* 时间过滤器 */
	import {formatDate} from 'common/js/date';

	const ALL = 2;
	const ERR_OK = 0;
	export default {
		props: {
			/* 获取商家信息 */
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			};
		},
		created() {
			/* 获取评论的数据 */
			this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.ratings = response.data;
					this.$nextTick(() => {
						/* 滚动开启 */
						this.scroll = new BScroll(this.$refs.ratings, {
							/* 允许点击事件 */
							click: true
						});
					});
				}
			});
		},
		methods: {
			/* 评论选择出现 */
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			},
			/* 评论选择出现类型 */
			selectRating(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			/* 是否出现有评论内容 */
			toggleContent() {
				this.onlyContent = !this.onlyContent;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		filters: {
			/* 时间过滤器 */
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		components: {
			star,
			split,
			ratingselect
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.ratings
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		/* 综合评分(头部) */
		.overview
			display: flex
			padding: 18px 0
			/* 评分左边(大评分) */
			.overview-left
				flex: 0 0 137px
				width: 137px
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				text-align: center
				/* 兼容iPhone5 */
				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px
				.score
					margin-bottom: 6px
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)
				.title
					margin-bottom: 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17, 27)
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
			/* 评分右边(两种评分、送到时间) */
			.overview-right
				flex: 1
				padding: 6px 0 6px 24px
				/* 兼容iPhone5 */
				@media only screen and (max-width: 320px)
					padding-left: 6px
				/* 服务态度、商品评分 */
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(7, 17, 27)
					.star
						display: inline-block
						margin: 0 12px
						vertical-align: top
					.score
						display: inline-block
						line-height: 18px
						vertical-align: top
						font-size: 12px
						color: rgb(255, 153, 0)
				/* 送到时间 */
				.delivery-wrapper
					font-size: 0
					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.delivery
						margin-left: 12px
						font-size: 12px
						color: rgb(147, 153, 159)
		/* 评论内容 */
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				/* 头像 */
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					position: relative
					flex: 1
					/* 用户名 */
					.name
						margin-bottom: 4px
						line-height: 12px
						font-size: 10px
						color: rgb(7, 17, 27)
					.star-wrapper
						margin-bottom: 6px
						font-size: 0
						/* 评分 */
						.star
							display: inline-block
							margin-right: 6px
							vertical-align: top
						/* 送到时间 */
						.delivery
							display: inline-block
							vertical-align: top
							line-height: 12px
							font-size: 10px
							color: rgb(147, 153, 159)
					/* 评论文字 */
					.text
						margin-bottom: 8px
						line-height: 18px
						color: rgb(7, 17, 27)
						font-size: 12px
					.recommend
						line-height: 16px
						font-size: 0
						.icon-thumb_up, .item
							display: inline-block
							margin: 0 8px 4px 0
							font-size: 9px
						.icon-thumb_up
							color: rgb(0, 160, 220)
						.item
							padding: 0 6px
							border: 1px solid rgba(7, 17, 27, 0.1)
							border-radius: 1px
							color: rgb(147, 153, 159)
							background: #fff
					/* 评论时间 */
					.time
						position: absolute
						top: 0
						right: 0
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
</style>
