/**
 * 通过尺码表 来生成Col
 *
 * @param {Array} sizeList 尺码表
 * @returns
 */
function genColumns(sizeList) {
    // 原始columns
    let defaultColumns = [
        { title: '款式', key: 'style', align: 'center' },
        { title: '颜色', key: 'color', align: 'center' }
    ]
    let children = []
    // 添加尺码信息
    sizeList.forEach(v => {
        children.push({
            title: v,
            key: v,
            align: 'center'
        })
    })
    defaultColumns.push({
        title: '尺码',
        align: 'center',
        children: children
    })

    return defaultColumns
}

export default genColumns
