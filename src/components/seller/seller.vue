<template>
	<!-- 商家页面 -->
	<div class="seller" ref="seller">
		<!-- 内容 -->
		<div class="seller-content">
			<!-- 商家名称、评星 -->
			<div class="overview">
				<!-- 商家名 -->
				<h1 class="title">{{seller.name}}</h1>
				<!-- 描述 -->
				<div class="desc">
					<!-- 评星组件 -->
					<star :size="36" :score="seller.score"></star>
					<!-- 评星组件结束 -->
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<!-- 描述结束 -->
				<ul class="remark">
					<!-- 起送价 -->
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<!-- 起送价结束 -->
					<!-- 商家配送 -->
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<!-- 商家配送结束 -->
					<!-- 平均配送时间 -->
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
					<!-- 平均配送时间结束 -->
				</ul>
				<!-- 点击收藏 -->
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
				<!-- 点击收藏结束 -->
			</div>
			<!-- 商家名称、评星结束 -->
			<split></split>
			<!-- 公告与活动 -->
			<div class="bulletin">
				<!-- 标题 -->
				<h1 class="title">公告与活动</h1>
				<!-- 标题结束 -->
				<!-- 公告内容 -->
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<!-- 公告内容结束 -->
				<!-- 活动 -->
				<ul v-if="seller.supports" class="supports">
					<li class="support-item border-1px" v-for="(item,index) in seller.supports">
						<!-- 图标 -->
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<!-- 图标结束 -->
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
				<!-- 活动结束 -->
			</div>
			<!-- 公告与活动结束 -->
			<split></split>
			<!-- 商家实景 -->
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<!-- 商家实景图片 -->
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
						<!-- 商家实景图片结束 -->
					</ul>
				</div>
			</div>
			<!-- 商家实景结束 -->
			<split></split>
			<!-- 商家信息 -->
			<div class="info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">{{info}}</li>
				</ul>
			</div>
			<!-- 商家信息结束 -->
		</div>
		<!-- 内容结束 -->
	</div>
	<!-- 商家页面结束 -->
</template>

<script type="text/ecmascript-6">
	/* 评星组件 */
	import star from 'components/star/star';
	/* 滚动组件 */
	import BScroll from 'better-scroll';
	/* 分隔符 */
	import split from 'components/split/split';
	import {saveToLocal, loadFromLocal} from 'common/js/store';
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			};
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '未收藏';
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},
		/* 监视对象,这是监听如果‘商家被改变了’ */
		watch: {
			/* 实时监视seller这个对象 */
			'seller'() {
				this.$nextTick(function() {
					this._initScroll();
					this._initPics();
				});
			}
		},
		/* 在页面重新渲染的时候执行 */
		mounted() {
			this.$nextTick(() => {
				this._initScroll();
				this._initPics();
			});
		},
		methods: {
			/* 滚动页面 */
			_initScroll() {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.seller, {click: true});
				} else {
					this.scroll.refresh();
				}
			},
			/* 商家实景左右滚动 */
			_initPics() {
				/* 有图片的时候 */
				if (this.seller.pics) {
					/* 定义每个图片的宽度 */
					let picWidth = 120;
					let margin = 6;
					/* 计算（图片+magrin）* 图片的数量 - 最好一个没有magrin的图片 */
					let width = (picWidth + margin) * this.seller.pics.length - margin;
					/* 设置ul的宽度 */
					this.$refs.picList.style.width = width + 'px';
					this.$nextTick(() => {
						if (!this.picScroll) {
							this.picScroll = new BScroll(this.$refs.picWrapper, {
								scrollX: true,
								/* 横向滚动时,忽略竖向滚动 */
								eventPassthrough: 'vertical'});
						} else {
							this.picScroll.refresh();
						}
					});
				}
			},
			/* 收藏的点击事件 */
			toggleFavorite(event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		},
		components: {
			star,
			split
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.seller
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		/* 商家名称、评星 */
		.overview
			position: relative
			padding: 18px
			/* 商家名 */
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			/* 描述 */
			.desc
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				font-size: 0
				/* 评星组件 */
				.star
					display: inline-block
					margin-right: 8px
					vertical-align: top
				.text
					display: inline-block
					margin-right: 12px
					line-height: 18px
					vertical-align: top
					font-size: 10px
					color: rgb(77, 85, 93)
			/* 起送价、商家配送、平均配送时间 */
			.remark
				display: flex
				padding-top: 18px
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7, 17, 27, 0.1)
					&:last-child
						border: none
					h2
						margin-bottom: 4px
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.content
						line-height: 24px
						font-size: 10px
						color: rgb(7, 17, 27)
						.stress
							font-size: 24px
			/* 收藏 */
			.favorite
				position: absolute
				width: 50px
				right: 11px
				top: 18px
				text-align: center
				.icon-favorite
					display: block
					margin-bottom: 4px
					line-height: 24px
					font-size: 24px
					color: #d4d6d9
					&.active
						color: rgb(240, 20, 20)
				.text
					line-height: 10px
					font-size: 10px
					color: rgb(77, 85, 93)
		/* 公告与活动 */
		.bulletin
			padding: 18px 18px 0 18px
			.title
				margin-bottom: 8px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			/* 公告 */
			.content-wrapper
				padding: 0 12px 16px 12px
				border-1px(rgba(7, 17, 27, 0.1))
				.content
					line-height: 24px
					font-size: 12px
					color: rgb(240, 20, 20)
			/* 活动 */
			.supports
				.support-item
					padding: 16px 12px
					border-1px(rgba(7, 17, 27, 0.1))
					font-size: 0
					&:last-child
						border-none()
					.icon
						display: inline-block
						width: 16px
						height: 16px
						vertical-align: top
						margin-right: 6px
						background-size: 16px 16px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_4')
						&.discount
							bg-image('discount_4')
						&.guarantee
							bg-image('guarantee_4')
						&.invoice
							bg-image('invoice_4')
						&.special
							bg-image('special_4')
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27)
		/* 商家实景 */
		.pics
			padding: 18px
			.title
				margin-bottom: 12px
				line-height: 14px
				color: rgb(7, 17, 27)
				font-size: 14px
			.pic-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap
				.pic-list
					font-size: 0
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin: 0
		/* 商家信息 */
		.info
			padding: 18px 18px 0 18px
			color: rgb(7, 17, 27)
			.title
				padding-bottom: 12px
				line-height: 14px
				border-1px(rgba(7, 17, 27, 0.1))
				font-size: 14px
			.info-item
				padding: 16px 12px
				line-height: 16px
				border-1px(rgba(7, 17, 27, 0.1))
				font-size: 12px
				&:last-child
					border-none()
</style>
