/**
 * 对数据源加工, 计算跨行间距 step , 以及
 *
 * @param {*} data
 * @returns
 */
function manage(data) {
    let styleList = [] // 有哪些款式
    let sizeList = [] // 存放所有尺码
    data.forEach(item => {
        !styleList.includes(item.style)
            ? styleList.push(item.style)
            : styleList
        // 遍历所有数据的尺码信息 添加进尺码数组

        Object.keys(item).forEach(i => {
            if (i !== 'style' && i !== 'color' && i !== 'step') {
                !sizeList.includes(i.toUpperCase()) ? sizeList.push(i.toUpperCase()) : sizeList
            }
        })
    })
    // console.log(sizeList)
    // 按照尺码表重新排列数据
    let sizeMap = [
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL',
        'XXXXL'
    ]
    // 使用slice 赋值,普通方法是引用赋值,修改之后会联动
    const sizeMapCopy = sizeMap.slice(0)
    sizeMapCopy.forEach(e => {
        if (sizeList.indexOf(e) === -1) {
            sizeMap.splice(sizeMap.indexOf(e), 1)
        }
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
        styleStep.forEach((n, index) => {
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
    return {
        data,
        sizeMap
    }
}

export default manage
