<template>
	<div class="cartcontrol">
		<!-- 减少按钮 -->
		<transition name="move">
			<!-- @click.stop.prevent=“”阻止事件冒泡 -->
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<!-- 减少按钮结束 -->
		<!-- 数量 -->
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<!-- 数量结束 -->
		<!-- 增加按钮 -->
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
		<!-- 增加按钮结束 -->
	</div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';
	export default {
		props: {
			/* 传入当前选中的商品 */
			food: {
				type: Object
			}
		},
		methods: {
			/* 增加数量按钮函数 */
			addCart(event) {
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					Vue.set(this.food, 'count', 1);
				} else {
					this.food.count++;
				}
				this.$emit('add', event.target);
			},
			/* 减少数量按钮函数 */
			decreaseCart(event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			transition: all 0.3s linear
			&.move-enter-active,&.move-leave
				opacity: 1
				transform: translate3d(0, 0, 0)
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0,160,220)
				transition: all 0.3s linear
				transform: rotate(0)
			&.move-enter,&.move-leave-active
				opacity: 0
				transform: translate3d(24px, 0, 0)
				.inner
					transform: rotate(180deg)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0,160,220)
			
</style>
