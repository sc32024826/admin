import axios from '@/libs/api.request'
// 获取员工信息
export const getEmployeeData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}
// 获取客户信息
export const getGuestData = () => {
  return axios.request({
    url: 'get_guest_data',
    method: 'get'
  })
}
// 获取订单信息
export const getOrderData = () => {
  return axios.request({
    url: 'order_manage',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}
// 获取 组织架构
export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
