import { getSize } from '@/view/utils/index'
/**
 * 通过尺码表 来生成Col
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
