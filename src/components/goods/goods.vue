<template>
	<!-- 商品组件 -->
	<div class="goods">
		<!-- 左侧目录 -->
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, $index) in goods" class="menu-item" :class="{'current': currentIndex === $index}" @click="selectMenu($index,$event)">
					<span class="text border-1px">
						<!-- 通过数据里的type是否大于0,判断时候有活动小图标 -->
						<span v-show="item.type>0" class="icon" :class='classMap[item.type]'></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<!-- 左侧目录结束 -->
		<!-- 右侧目录 -->
		<div class="foods-wrapper" ref="foodsWrapper">
			<!-- 商品分类,按照左侧分类 -->
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<!-- 分类名 -->
					<h1 class="title">{{item.name}}</h1>
					<!-- 商品列表 -->
					<ul>
						<!-- @click="selectFood(food,$event)"将商品信息传入到food组件 -->
						<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
							<!-- 商品图片 -->
							<div class="icon">
								<img width="57" height="57" :src="food.icon" :alt="food.name">
							</div>
							<!-- 商品图片结束 -->
							<!-- 商品内容 -->
							<div class="content">
								<!-- 商品名字 -->
								<h2 class="name">{{food.name}}</h2>
								<!-- 商品描述 -->
								<p class="desc">{{food.description}}</p>
								<!-- 商品销售情况、好评率 -->
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<!-- 商品价格 -->
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<!-- 商品添加,减少控件 -->
								<div class="cartcontrol-wrapper">
									<cartcontrol @add="addFood" :food="food"></cartcontrol>
								</div>
								<!-- 商品添加,减少控件结束 -->
							</div>
							<!-- 商品内容结束 -->
						</li>
					</ul>
					<!-- 商品列表结束 -->
				</li>
			</ul>
			<!-- 商品分类,按照左侧分类结束 -->
		</div>
		<!-- 右侧目录结束 -->
		<!-- 购物车组件引入，select-foods:被选中的food; delivery-price:配送费; min-price:最低起送-->
		<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<!-- 购物车组件引入结束 -->
		<!-- 引用商品详情页food组件 -->
		<food @add="addFood" :food="selectedFood" ref="food"></food>
		<!-- 引用商品详情页food组件结束 -->
	</div>
	<!-- 商品组件结束 -->
</template>

<script type="text/ecmascript-6">
	/* 滚动组件 */
	import BScroll from 'better-scroll';
	/* 购物车组件 */
	import shopcart from 'components/shopcart/shopcart';
	/* 控制数量组件 */
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	/* food商品详情组件 */
	import food from 'components/food/food';
	const ERR_OK = 0;
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				/* 商品 */
				goods: [],
				/* 每个区间的高度 */
				listHeight: [],
				/* foodsWrapper内容现在所在高度 */
				scrollY: 0,
				/* 商品详细页food组件传入 */
				selectedFood: {}
			};
		},
		computed: {
			/* 计算右侧内容滚动时，左侧目录的索引 */
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					/* 判断foodsWrapper内容现在所在高度的情况，返回对应的索引值 */
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			/* 计算选中的商品,放在数组foods中，再传入shopcart组件中 */
			selectFoods() {
				let foods = [];
				this.goods.forEach(function(good) {
					good.foods.forEach(function(food) {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created: function() {
			/* 拿到goods的数据 */
			this.$http.get('/api/goods').then(response => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					/* 异步请求，在当前事件完成后执行 */
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},
		/* 方法名可以根据this.访问到 */
		methods: {
			selectMenu(index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				/* 根据索引跳转到当前页面，scrollToElement（dom,时间） */
				this.foodsScroll.scrollToElement(el, 300);
			},
			addFood(target) {
				this._drop(target);
			},
			_drop(target) {
				// 体验优化,异步执行下落动画
				this.$nextTick(() => {
					/* this.$refs.shopcart可以访问子组件 */
					this.$refs.shopcart.drop(target);
				});
			},
			/* 用于初始化better-scroll的滚动方法 */
			_initScroll() {
				/* this.meunScroll = new BScroll(document.getElementById('menu_wrapper'), {
					click: true
				}); */

				this.meunScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				});
				/* this.foodsScroll = new BScroll(document.getElementById('foods_wrapper'), {
					click: true,
					probeType: 3
				}); */
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					/* probeType: 3的意思是foodsScroll在滚动时，能时时告诉我们滚动的位置 */
					probeType: 3
				});
				/* probeType: 3得到的位置，我们监听的就是scroll，pos就是位置 */
				this.foodsScroll.on('scroll', (pos) => {
					/* Math.round为转换为整数，Math.abs为绝对值 */
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			/* 计算每个商品类 的高度区间 */
			_calculateHeight() {
				/* 获取商品类区间的Dom节点,是个数组 */
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				/* 遍历每个商品类区间并加入到listHeight数组 */
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					/* clientHeight为当前商品类区间的高度 */
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			/* 实现food页面的加载（出现） */
			selectFood(food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectedFood = food;
				/* 父组件可以访问到子组件的方法 */
				this.$refs.food.show();
			}
		},
		components: {
			'shopcart': shopcart,
			'cartcontrol': cartcontrol,
			'food': food
		},
		events: {
			'cart.add': function(target) {
				this._drop(target);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";
	/* 商品组件 */
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		/* 左侧目录 */
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				/* 运用了table布局 */ 
				display: table
				height: 54px
				width: 64px
				line-height: 14px
				padding: 0px 8px
				text-align: center
				/* 被选中的样式 */
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background: #fff
					font-weight: 700
					.text
						border-none()
				/* 让下文垂直居中table-cell */
				.text
					display: table-cell
					width: 64px
					vertical-align: middle
					border-1px(rgba(7,17,27,0.1))
					font-size: 12px
				.icon
					display: inline-block
					vertical-align: bottom
					width: 12px
					height: 12px
					margin-left: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
		/* 右侧内容 */
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147,153,159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7,17,27)
					.desc, .extra
						margin-bottom: 8px
						line-height: 10px
						font-size: 10px
						color: rgb(147,153,159)
					.desc
						line-height: 12px
						margin-bottom: 8px
					.extra
						& .count
							margin-right: 8px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px
							color: rgb(240,20,20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147,153,159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px
						
</style>
