/**
 * 对数据源加工,计算跨行间距step
 * @param {Array} data
 * @returns {Array}
 */
function manage(data) {
    let styleList = [] // 有哪些款式
    data.forEach(item => {
        !styleList.includes(item.style)
            ? styleList.push(item.style)
            : styleList
    })
    // console.log(sizeMap)
    // 罗列出所有款式之后 预设所有款式的跨行为0
    let styleStep = [] // 定义每个款式的跨行
    styleList.forEach(it => {
        styleStep.push({
            style: it,
            step: 0
        })
    })
    // 计算表格的跨行
    data.forEach(items => {
        styleStep.forEach(it => {
            items.style === it.style ? it.step++ : it.step
        })
    })
    data.forEach(it => {
        styleStep.forEach(n => {
            if (it.style === n.style) {
                if (styleList.includes(it.style)) {
                    it.step = n.step
                    styleList.splice(styleList.indexOf(it.style), 1)
                } else {
                    it.step = 0
                }
            }
        })
    })
    return data
}

export default manage
