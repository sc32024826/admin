/**
 * 对数据源加工,计算跨行间距step
 * @param {Array} data
 * @returns {Array}
 */
function dataFormat (data) {
	// 首先取出数组的第一行元素
	var _first = data.shift()
	// 取出数组第一行内容 订单号 款号 颜色
	var _order = _first.orderID
	var _style = _first.style
	var _color = _first.color
	_first['orderStep'] = 1
	_first['styleStep'] = 1
	_first['colorStep'] = 1
	data.forEach((v, k) => {
		let order_temp = _first
		let style_temp = _first
		let color_temp = _first

		if (v.orderID === _order) {
			order_temp['orderStep'] += 1
			v['orderStep'] = 0
			if (v.style === _style) {
				style_temp['styleStep'] += 1
				v['styleStep'] = 0
				if (v.color === _color) {
					console.log(v)
					color_temp['colorStep'] += 1
					v['colorStep'] = 0
				} else {
					console.log('颜色改变', _color, v.color, k)
					color_temp = v
					console.log(color_temp)
					_color = v.color
					v['colorStep'] = 1
				}
			} else {
				style_temp = v
				console.log('款式改变', _style, v.style, k)
				_style = v.style
				v['styleStep'] = 1
				v['colorStep'] = 1
			}
		} else {
			console.log('订单号不同,')
			order_temp = v
			_order = v.orderID
			v['orderStep'] = 1
			v['styleStep'] = 1
			v['colorStep'] = 1
		}
		console.log(_first.orderStep, _first.styleStep, _first.colorStep)
		console.log(v.orderStep, v.styleStep, v.colorStep)
		console.log('--------------')
	})
	data.unshift(_first)
	// 定义订单号 款号 颜色 三个字段的步长
	// var orderStep = 1
	console.log(data)
	return data
}

export default dataFormat
