import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
import orgData from './data/org-data'
import { treeData } from './data/tree-select'
const Random = Mock.Random

// 伪造员工信息
export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      id: '@integer(4)',
      name: '@name',
      department: '@string'
    }))
  })
  return tableData
}

// 伪造客户信息
export const getGuestData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      id: Random.increment(10),
      nichen: '@name',
      name: '@name',
      contact: '@name',
      tel: /^1(5|3|7|8)[0-9]{9}$/
    }))
  })
  return tableData
}
// 伪造订单信息
export const getOrderData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      id: Random.increment(10),
      name: Random.csentence(10, 13),
      startDate: '@DATETIME("yyyy-MM-dd")',
      endDate: '@DATETIME("yyyy-MM-dd")',
      details: Random.csentence(10, 13)
    }))
  })
  return tableData
}

export const uploadImage = req => {
  return Promise.resolve()
}

export const getOrgData = req => {
  return orgData
}

export const getTreeSelectData = req => {
  return treeData
}
