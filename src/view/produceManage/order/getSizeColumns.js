import { getSize } from '@/api/utils'
/**
 * 通过尺码表 来生成订单的列字段名,包括款式颜色尺码,后期需要添加合适的操作按钮
 *
 * @returns
 */
function genColumns() {
    // 原始columns
    let defaultColumns = [
        { title: '款式', key: 'style', align: 'center' },
        { title: '颜色', key: 'color', align: 'center' }
    ]
    let list = getSize()
    let children = []
    list.forEach(v => {
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
