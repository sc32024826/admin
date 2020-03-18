<template>
  <div>
    <Card>
      <tables
        ref="tables"
        stripe
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-selection-change="selectionChange"
        @on-new-info="openDrawer_newItem"
        @on-muti-delete="deleteMany"
        @on-save-edit="paramsEdit"
        @on-row-dblclick="onRowClick"
      />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Card>
      <Modal title="添加订单" v-model="drawer_new_item" width="90%">
        <Form :model="formData">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="客户名称" label-position="top">
                <Input v-model="formData.name" placeholder="请输入客户名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="订单日期" label-position="top">
                <DatePicker placeholder="Select date" type="date"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="交货日期" label-position="top">
                <DatePicker placeholder="Select date" type="date"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="订单详情" label-position="top">
                <Table :columns="orderColumns" :data="orderData" border :span-method="handleSpan"></Table>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div class="demo-drawer-footer">
          <Button style="margin: 8px" @click="drawer_new_item= false">取消</Button>
          <Button type="primary" @click="submit(formData)">提交</Button>
        </div>
      </Modal>
      <Modal title="订单详情" v-model="bShowDetails">
        <Table :columns="orderColumns" :data="orderData" border :span-method="handleSpan"></Table>
      </Modal>
      <Modal
        v-model="bShowModel_details"
        title="订单详情"
        @on-ok="ok()"
        @on-canccel="that.bShowModel_details = false"
        width="90%"
      >
        <Form :model="order">
          <Row :gutter="32">
            <Col span="8">
              <FormItem label="客户名称" label-position="top">
                <Input v-model="order.name" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="订单日期" label-position="top">
                <DatePicker v-model="order.startDate"></DatePicker>
              </FormItem>
            </Col>

            <Col span="12">
              <FormItem label="交货日期" label-position="top">
                <DatePicker v-model="order.endDate"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="订单详情" label-position="top">
                <Table :columns="orderColumns" :data="orderData" border :span-method="handleSpan"></Table>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Button style="margin-right: 10px;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Button style="margin-right: 10px;" type="warning" @click="handleEdit()">编辑数量</Button>
        <Button type="primary" @click="additem">添加条目</Button>
      </Modal>
      <Modal
        v-model="bShowModel_add"
        title="新增条目"
        :mask-closable="false"
        @on-ok="addnewitemok"
        @on-cancel="bShowModel_add = false"
      >
        <Form :model="newItem">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="款式" label-position="top">
                <Select
                  v-model="current_style"
                  filterable
                  allow-create
                  @on-create="handleCreate_style"
                  @blur="handleCreate_style"
                >
                  <Option
                    v-for="(item,index) in newItem.style"
                    :key="index"
                    :value="item.value"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="颜色" label-position="top">
                <Select
                  v-model="current_color"
                  filterable
                  allow-create
                  @on-create="handleCreate_color"
                  @blur="handleCreate_color"
                >
                  <Option
                    v-for="(item,index) in newItem.color"
                    :key="index"
                    :value="item.value"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="10">
            <Col span="8" v-for="(item, index) in current_size" :key="index">
              <FormItem label="尺码" label-position="top">
                <Select
                  v-model="item.s"
                  filterable
                  allow-create
                  @on-create="handleCreate_size"
                  @blur="handleCreate_size"
                >
                  <Option v-for="(v,k) in newItem.size" :key="k" :value="v.value">{{v.value}}</Option>
                </Select>
              </FormItem>
              <FormItem label="数量" label-position="top">
                <Input v-model="item.v" placeholder="输入件数" />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Button type="primary" style="margin-right: 10px;" @click="addSize()">新增尺码</Button>
        <Button type="warning" @click="removeSize()">减少尺码</Button>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderData } from '@/api/data'
import manage from './dataSourceAction'
import reGenrateColumns from './columns'

export default {
    name: 'tables_page',
    components: {
        Tables
    },
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: '60',
                    align: 'center',
                    key: 'sele'
                },
                {
                    title: '订单号',
                    key: 'id',
                    sortable: true,
                    width: 150,
                    align: 'center'
                },
                { title: '客户名称', key: 'name' },
                { title: '订单日期', key: 'startDate' },
                { title: '交货日期', key: 'endDate' },
                {
                    title: '订单详情',
                    key: 'detail',
                    render: (h, params) => {
                        return [
                            h(
                                'Button',
                                {
                                    props: { type: 'primary', size: 'small' },
                                    style: { 'margin': '2px' },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.details)
                                        }
                                    }
                                },
                                '查看详情'
                            ),
                            h(
                                'Button',
                                {
                                    props: { type: 'warning', size: 'small' },
                                    style: { 'margin': '2px' },
                                    on: {
                                        click: () => {
                                            this.onRowClick(params.row)
                                        }
                                    }
                                },
                                '修改内容'
                            )
                        ]
                    }
                }
            ],
            tableData: [],
            drawer_new_item: false,
            drawer_deleteMany: false,
            drawer_editinfo: false,
            formData: {
                id: '',
                name: '',
                department: ''
            },
            selection: [],
            allDepartment: [],
            order: {},
            // 处理之后的数据
            manageData: {
                data: [],
                sizeMap: []
            },
            // 交叉表数据
            orderColumns: [
                { title: '款式', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' }
            ],
            // 订单详情 details
            orderData: [],
            // 尺码表
            sizeList: [{ id: '', value: '' }],
            // 控制model的开关显示
            bShowModel_details: false,
            bShowModel_add: false,
            // 下拉选择器当前显示的内容
            newItem: {
                style: '',
                color: '',
                size: ''
            },
            current_style: '',
            current_color: '',
            current_size: [],
            // 打开对话框
            bShowDetails: false
        }
    },
    methods: {
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                return {
                    rowspan: row.step === 0 ? 0 : row.step,
                    colspan: row.step === 0 ? 0 : 1
                }
            }
        },
        // 显示详情页
        showDetails(data) {
            // 显示对话框
            this.bShowDetails = true
            // 需要加工数据源 获得 合并跨度
            this.manageData = manage(data)
            console.log(this.manageData)
            // 更新交叉表 列名
            let newColumns = this.manageData.sizeMap // 新的尺码表
            console.log(newColumns)
            // 重新生成尺码表
            this.orderColumns = reGenrateColumns(newColumns)
            console.log(this.orderColumns)
            // 数据填充
            this.orderData = this.manageData.data
        },
        exportExcel() {
            this.$refs.tables.exportCsv({
                filename: `table-${new Date().valueOf()}.csv`
            })
        },
        // 选项改变时触发
        selectionChange(selection) {
            this.selection = selection
        },
        // 打开抽屉-新建item
        openDrawer_newItem() {
            this.drawer_new_item = true
            console.log('显示新的抽屉')
        },

        // 打开批量删除的抽屉
        deleteMany() {
            this.drawer_deleteMany = true
        },
        // 删除勾选项
        deleteConfirm() {
            // 勾选项 为 selection
            // 调用axios 删除 selection 匹配的数据
        },
        // 修改操作
        paramsEdit(params) {
            console.log(params)
            // 关键字段
            // params.row.id
            // 修改成
            // params.value

            // 调用axios 更新数据源
        },
        // 打开抽屉修改 内容
        onRowClick(row) {
            var that = this
            that.bShowModel_details = true
            that.order = row
            // 将数据源 填充
            that.manageData = manage(row.details)
            // 更新交叉表 列名
            let newColumns = that.manageData.sizeMap // 新的尺码表
            // 重新生成尺码表
            that.orderColumns = reGenrateColumns(newColumns)
            // 添加 操作按钮
            that.orderColumns.push({
                title: '操作',
                align: 'center',
                render(h, params) {
                    return h(
                        'Button',
                        {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    that.remove(params.index)
                                }
                            }
                        },
                        '删除'
                    )
                }
            })
            // console.log(columnsNames)
            this.orderData = this.manageData.data
            // console.log(this.orderData)
        },
        // 订单修改提交
        confirmEdit(data) {},
        // 将数据源修改成需要的格式
        TurnType(array) {
            // console.log(array)
            return array
        },
        edit_count() {},
        // 确认修改操作
        ok() {
            console.log(this.order)
            // 调用axios
        },
        handleEdit() {},
        // 删除一行数据之后 造成 合并单元格 规则出错 需要重新 修改规则
        remove(index) {
            this.orderData.splice(index, 1)
            this.manageData = manage(this.orderData)
        },
        // 添加订单条目
        additem() {
            this.bShowModel_add = true
            console.log('改变显示状态')
            // 定义一个数组 用于存放下拉选择器可选项的数组
            let styleli = []
            let colorli = []
            let size = [{ value: 'S' }, { value: 'M' }, { value: 'L' }]
            // console.log(this.orderData)
            this.orderData.forEach(i => {
                !styleli.includes(i.style) ? styleli.push(i.style) : styleli
                !colorli.includes(i.color) ? colorli.push(i.color) : colorli
            })
            let style = []
            styleli.forEach((v, k) => {
                style.push({
                    value: v
                })
            })
            let color = []
            colorli.forEach((v, k) => {
                color.push({
                    value: v
                })
            })
            this.newItem = {
                style: style,
                color: color,
                size: size
            }
        },
        handleCreate_style(val) {
            console.log('增加款式' + val)
            // console.log(this.newItem.style)
            this.newItem.style.push({ value: val, label: val })
        },
        handleCreate_color(val) {
            console.log('增加颜色' + val)
            this.newItem.color.push({ value: val, label: val })
        },
        handleCreate_size(val) {
            console.log('增加尺码' + val)
            this.newItem.size.push({ value: val, label: val })
        },
        addnewitemok() {
            let item = {
                style: this.current_style,
                color: this.current_color
            }
            this.current_size.forEach((v, k) => {
                // v.s 标识尺码号  v.v 表示该尺码数量
                item[v.s] = v.v
            })
            console.log(item)
            // 需要将这个新的数据 添加进 数据源中
            this.orderData.push(item)
            // 如果添加的款式 已经存在,则需要重新计算合并规则
            // if(this.current_style)
            // console.log(this.newItem.style)
        },
        // 新增一个尺码
        addSize() {
            // console.log(this.current_size)
            this.current_size.push({ s: '输入尺码', v: '' })
        },
        removeSize() {
            this.current_size.pop()
        }
    },
    mounted() {
        getOrderData().then(res => {
            this.tableData = res.data
        })
    }
}
</script>

<style>
.demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
