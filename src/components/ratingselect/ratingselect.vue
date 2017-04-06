<template>
	<!-- 评价选择项组件 -->
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<!-- 选择“全部” -->
			<span class="block positive" @click="select(2,$event)" :class="{'active':selectType===2}">
				{{desc.all}}
				<span class="count">{{ratings.length}}</span>
			</span>
			<!-- 选择“全部”结束 -->
			<!-- 选择“满意” -->
			<span class="block positive" @click="select(0,$event)" :class="{'active':selectType===0}">
				{{desc.positive}}
				<span class="count">{{positives.length}}</span>
			</span>
			<!-- 选择“满意”结束 -->
			<!-- 选择“不满意” -->
			<span class="block negative" @click="select(1,$event)" :class="{'active':selectType===1}">
				{{desc.negative}}
				<span class="count">{{negatives.length}}</span>
			</span>
			<!-- 选择“不满意”结束 -->
		</div>
		<!-- 是否参看全部评价 -->
		<div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
		<!-- 是否参看全部评价结束 -->
	</div>
	<!-- 评价选择项组件结束 -->
</template>
<script type="text/ecmascript-6">
	const POSITIVE = 0;/* 满意 */
	const NEGATIVE = 1;/* 不满意 */
	const ALL = 2;/* 所有 */
	export default {
		props: {
			/* 返回的评价 */
			ratings: {
				type: Array,
				/* 数据的对象都要返回函数 */
				default() {
					return [];
				}
			},
			/* 返回选择类型，用数字代替 */
			selectType: {
				type: Number,
				/* 默认选择所有的 */
				default: ALL
			},
			/* 是否读取有内容的评价 */
			onlyContent: {
				type: Boolean,
				default: false
			},
			/* 描述 */
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					};
				}
			}
		},
		methods: {
			/* 选择全部、满意、吐槽函数 */
			select(type, event) {
				if (!event._constructed) {
					return;
				}
				/* this.selectType = type; */
				this.$emit('select', type);
			},
			toggleContent(event) {
				if (!event._constructed) {
					return;
				}
				/* this.onlyContent = !this.onlyContent; */
				this.$emit('toggle');
			}
		},
		computed: {
			/* 计算满意的长度 */
			positives() {
				/* filter过滤 */
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE;
				});
			},
			/* 计算不满意的长度 */
			negatives() {
				/* filter过滤 */
				return this.ratings.filter(function(rating) {
					return rating.rateType === NEGATIVE;
				});
			}
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.ratingselect
		.rating-type
			padding: 18px 0
			margin: 0 18px
			border-1px(rgba(7, 17, 27, 0.1))
			font-size: 0
			.block
				display: inline-block
				padding: 8px 12px
				margin-right: 8px
				line-height: 16px
				border-radius: 1px
				font-size: 12px
				color: rgb(77, 85, 93)
				&.active
					color: #fff
				.count
					margin-left: 2px
					font-size: 8px
				&.positive
					background: rgba(0, 160, 220, 0.2)
					&.active
						background: rgb(0, 160, 220)
				&.negative
					background: rgba(77, 85, 93, 0.2)
					&.active
						background: rgb(77, 85, 93)
		.switch
			padding: 12px 18px
			line-height: 24px
			border-bottom: 1px solid rgba(7, 17, 27, 0.1)
			color: rgb(147, 153, 159)
			font-size: 0
			&.on
				.icon-check_circle
					color: #00c850
				.text
					color: #00c850
			.icon-check_circle
				display: inline-block
				vertical-align: top
				margin-right: 4px
				font-size: 24px
			.text
				display: inline-block
				vertical-align: top
				font-size: 12px
</style>
