/**!
 * 数据建模概况
 * date:2020-10-15
 * author: xhz;
 */

Vue.component('v-chart', VueECharts);

var vm = new Vue({
	el: '#app', //绑定dom元素
	data: {
		flowData: [], // 数据建模流程
		platformData: [], //平台模型数据统计
		line: {
			tooltip: {
				show: true,
			},
			grid: {
				top: 40,
				right: 30,
				bottom: 0,
				left: 20,
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#5c5c5c',
					fontFamily: 'Source',
				},
				data: [],
			},
			yAxis: {
				name: '(个)',
				nameTextStyle: {
					padding: [0, 30, 0, 0],
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#5c5c5c',
					fontFamily: 'Source',
				},
				type: 'value',
			},
			series: [
				{
					data: [],
					type: 'line',
					color: '#93d497',
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(147,212,151,0.8)',
								},
								{
									offset: 1,
									color: 'rgba(147,212,151,0)',
								},
							],
							global: false,
						},
					},
				},
			],
		},

		bar: {
			legend: {
				data: ['导入文件', '导入数据库'],
				left: '60%',
				top:10
			},
			tooltip: {
				show: true,
			},
			grid: {
				top: 80,
				right: 30,
				bottom: 0,
				left: 20,
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				// boundaryGap: false,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#5c5c5c',
					fontFamily: 'Source',
				},
				data: [],
			},
			yAxis: {
				name: '(次)',
				nameTextStyle: {
					padding: [0, 30, 20, 0],
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#5c5c5c',
					fontFamily: 'Source',
				},
				type: 'value',
			},

			series: [
				{
					name: '导入文件',
					data: [0],
					type: 'bar',
					color: '#2590eb',
					barWidth: 18,
					itemStyle: {
						barBorderRadius: [3, 3, 0, 0],
					},
				},
				{
					name: '导入数据库',
					data: [],
					type: 'bar',
					color: '#4cc5aa',
					barWidth: 18,
					itemStyle: {
						barBorderRadius: [3, 3, 0, 0],
					},
				},
			],
		},
	},
	methods: {
		// 请求数据建模流程
		getFlowData: function () {
			var self = this;
			Util.ajax({
				url: getflow,
			}).done(function (data) {
				self.flowData = data.list;
			});
		},
			//平台模型数据统计
		getPlatformData: function () {
			var self = this;
			Util.ajax({
				url: getplatform,
			}).done(function (data) {
				self.platformData = data.total;
				self.line.xAxis.data = data.statistics.name;
				self.line.series[0].data= data.statistics.data;
			});
		},
		//近一周个人导入情况统计
		getDataBaseData: function () {
			var self = this;
			Util.ajax({
				url: getmodelUseData,
			}).done(function (data) {
				// console.log(dtata)
				self.bar.xAxis.data = data.statistics.name;
				self.bar.series[0].data= data.statistics.fileData;
				self.bar.series[1].data= data.statistics.DataBaseData;
			});
		},
	},
	mounted: function () {
		var self = this;
		self.getFlowData();
		self.getPlatformData();
		self.getDataBaseData();
	},
});
