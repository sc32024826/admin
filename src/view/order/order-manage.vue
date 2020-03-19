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
        @on-muti-delete="deleteObject"
        @on-row-dblclick="onRowClick"
      />
      <Button
        style="margin: 10px 0;"
        icon="md-download"
        :loading="exportLoading"
        @click="exportExcel"
      >导出为Csv文件</Button>
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
                <Table :columns="orderColumns" :data="order.data" border :span-method="handleSpan"></Table>
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
        <Row>
          <Col span="12" offset="6" align="center">
            <h2>{{currentOrder.name}}</h2>
          </Col>
        </Row>
        <Row type="flex" justify="space-between">
          <Col span="6">
            <h4>订单号:{{currentOrder.id}}</h4>
          </Col>
          <Col span="8" align="right">
            <h4>订单日期:{{currentOrder.startDate}}</h4>
          </Col>
          <Col span="8" align="right">
            <h4>交货日期:{{currentOrder.endDate}}</h4>
          </Col>
        </Row>
        <Table :columns="orderColumns" :data="order.data" border :span-method="handleSpan"></Table>
        <div class="demo-drawer-footer">
          <Button
            icon="md-download"
            :loading="exportLoading"
            @click="exportExcel_detail"
            disabled
          >导出为Csv文件</Button>
        </div>
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
                <Table :columns="orderColumns" :data="order.data" border :span-method="handleSpan"></Table>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Button type="primary" @click="additem">添加条目</Button>
      </Modal>
      <Modal
        ref="addNewLine"
        v-model="bShowModel_add"
        title="新增条目"
        :mask-closable="false"
        @on-ok="addnewitemok('newItem')"
        @on-cancel="bShowModel_add = false"
      >
        <Form :model="newItem" :rules="rulesNewItem">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="款式" label-position="top" prop="style">
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
              <FormItem label="颜色" label-position="top" prop="color">
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
              <FormItem label="尺码" label-position="top" prop="size">
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
              <FormItem label="数量" label-position="top" prop="count">
                <Input v-model="item.v" placeholder="输入件数" />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Button type="primary" style="margin-right: 10px;" @click="addSize()">新增尺码</Button>
        <Button type="warning" @click="removeSize()">减少尺码</Button>
      </Modal>
      <Modal
        v-model="bDelete"
        title="您确认要删除以下内容吗?"
        @on-ok="confirmToDelete()"
        @on-cancel="bDelete = false"
      >
        <Table :columns="wannaDelete.columns" :data="wannaDelete.data"></Table>
      </Modal>
    </Card>
    <Modal title="修改内容" v-model="isShowdetailsEdit">
      <Form :model="detailsItem">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="款式" label-position="top">
              <Input v-model="detailsItem.style" disabled />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="颜色" label-position="top">
              <Input v-model="detailsItem.color" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32" v-for="(item,index) in detailsItem.size" :key="index">
          <Col span="12">
            <FormItem :label="item.size" label-position="top">
              <Input v-model="item.count" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderData } from '@/api/data'
import manage from './dataSourceAction'
import getColumns from './getSizeColumns'
import excel from '@/libs/excel'
// import validate from 'async-validator'

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
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return [
                            h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: { margin: '2px' },
                                        on: {
                                            click: () => {
                                                this.showDetails(params.row)
                                            }
                                        }
                                    },
                                    '查看详情'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        style: { margin: '2px' },
                                        on: {
                                            click: () => {
                                                this.onRowClick(params.row)
                                            }
                                        }
                                    },
                                    '修改内容'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: { type: 'error', size: 'small' },
                                        style: { margin: '2px' },
                                        on: {
                                            click: () => {
                                                this.deleteObject(params.row)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        ]
                    }
                }
            ],
            tableData: [],
            drawer_new_item: false,
            drawer_editinfo: false,
            exportLoading: false,
            formData: {
                id: '',
                name: '',
                department: ''
            },
            selection: [],
            allDepartment: [],
            order: {
                name: '',
                startDate: '',
                endDate: '',
                data: []
            },
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
            rulesNewItem: {
                style: {
                    required: true,
                    message: '请输入款式',
                    trigger: 'blur'
                },
                color: {
                    required: true,
                    message: '请输入颜色',
                    trigger: 'blur'
                },
                count: {
                    required: true,
                    message: '请输入款式',
                    trigger: 'blur',
                    type: Number
                },
                size: {
                    required: true,
                    message: '请输入尺码',
                    trigger: 'blur',
                    type: String
                }
            },
            current_style: '',
            current_color: '',
            current_size: [],
            // 打开对话框
            bShowDetails: false, // 显示订单详情的对话框
            bDelete: false, // 确认删除对话框
            // 将要删除的内容
            wannaDelete: {
                columns: [
                    { title: '订单号', key: 'id', width: 150, align: 'center' },
                    { title: '客户名称', key: 'name' }
                ],
                data: []
            },
            // 当前点击行的订单object
            currentOrder: {},
            // 显示修改订单内容的对话框
            isShowdetailsEdit: false,
            // 订单内容的单行数据
            detailsItem: {}
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
            let deatil = data.details
            this.currentOrder = data
            console.log('点击了查看详情按钮')
            // 显示对话框
            this.bShowDetails = true
            // 需要加工数据源 获得 合并跨度
            this.manageData = manage(deatil)
            console.log(this.manageData)
            // 更新交叉表 列名
            let newColumns = this.manageData.sizeMap // 新的尺码表
            console.log(newColumns)
            // 重新生成尺码表
            this.orderColumns = getColumns(newColumns)
            console.log(this.orderColumns)
            // 数据填充
            this.order.data = this.manageData.data
        },
        exportExcel() {
            if (this.tableData.length) {
                this.exportLoading = true
                let dataCopy = this.tableData.slice(0)
                // 遇到长数字比如身份证时需要在数字前添加'\t',否则cvs显示会异常
                dataCopy.forEach(v => {
                    v.id = '\t' + v.id
                })
                console.log(dataCopy)
                let params = {
                    title: ['订单号', '客户名称', '订单日期', '交货日期'],
                    key: ['id', 'name', 'startDate', 'endDate'],
                    data: dataCopy,
                    autoWidth: true,
                    filename: '订单表'
                }
                excel.export_array_to_excel(params)
                this.exportLoading = false
            } else {
                this.$Message.info('表格数据不能为空！')
            }
        },
        // 订单详情的导出
        exportExcel_detail() {
            // console.log(this.currentOrder)
            // if (this.currentOrder.length) {
            //     let params = {
            //         title: ['订单号', '客户名称', '订单日期', '交货日期'],
            //         key: ['id', 'name', 'startDate', 'endDate'],
            //         data: dataCopy,
            //         autoWidth: true,
            //         filename: '订单表'
            //     }
            //     excel.export_array_to_excel(params)
            //     this.exportLoading = false
            // } else {
            //     this.$Message.info('表格数据不能为空！')
            // }
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

        // 打开删除的对话框,data为要删除的对象
        deleteObject(data) {
            this.bDelete = true
            let needToDel = this.wannaDelete.data
            if (data) {
                console.log(data)
                needToDel.push({ id: data.id, name: data.name })
            } else {
                console.log(this.selection)
                let list = this.selection
                list.forEach(v => {
                    needToDel.push({ id: v.id, name: v.name })
                })
            }
        },
        // 删除已选项
        confirmToDelete() {
            let that = this
            // 勾选项 为 selection
            // 调用axios 删除 selection 匹配的数据
            // 数组
            let needToDel = that.wannaDelete.data
            // 删除完毕后之后更新数据源
            console.log(that.tableData)
            needToDel.forEach(v => {
                that.tableData = that.tableData.filter(item => item.id !== v.id)
            })

            // 清空wannaDelete.data
            that.wannaDelete.data = []
        },
        // 打开对话框修改 内容
        onRowClick(row) {
            var that = this
            that.bShowModel_details = true
            that.order.id = row.id
            that.order.name = row.name
            that.order.startDate = row.startDate
            that.order.endDate = row.endDate
            // 将数据源 填充
            that.manageData = manage(row.details)
            // 更新交叉表 列名
            let newColumns = that.manageData.sizeMap // 新的尺码表
            // 重新生成尺码表
            that.orderColumns = getColumns(newColumns)
            // 添加 操作按钮
            that.orderColumns.push({
                title: '操作',
                align: 'center',
                render: (h, params) => {
                    return [
                        h(
                            'Button',
                            {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: { margin: '2px' },
                                on: {
                                    click: () => {
                                        that.remove(params.index)
                                    }
                                }
                            },
                            '删除'
                        )
                    ]
                }
            })
            that.order.data = that.manageData.data
        },
        // 订单修改提交
        confirmEdit(data) {},

        edit_count() {},
        // 确认修改操作
        ok() {
            console.log(this.order)
            // 调用axios
        },
        // 修改订单信息
        handleEdit(params) {
            console.log(params)
            let item = this.detailsItem
            item.style = params.row.style
            item.color = params.row.color
            item.size = []

            this.isShowdetailsEdit = true

            let size = Object.keys(params.row)
            let removeString = ['style', 'color', 'step', '_index', '_rowKey']
            // 去除非尺码字段
            size = size.filter(v => !removeString.includes(v))
            size.forEach(e => {
                let c = params.row[e]
                item.size.push({ size: e, count: c })
            })
            console.log(item)
        },
        // 删除一行数据之后 造成 合并单元格 规则出错 需要重新 修改规则
        remove(index) {
            let data = this.order.data
            data.splice(index, 1)
            this.manageData = manage(data)
        },
        // 添加订单条目
        additem() {
            this.bShowModel_add = true
            console.log('改变显示状态')
            // 定义一个数组 用于存放下拉选择器可选项的数组
            let styleli = []
            let colorli = []
            let size = [{ value: 'S' }, { value: 'M' }, { value: 'L' }]
            // console.log(this.order.data)
            this.order.data.forEach(i => {
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
        addnewitemok(name) {
            // this.$refs[name].validate(valid => {
            //     if (valid) {
            //         this.$Message.success('Success!')
            //     } else {
            //         this.$Message.error('Fail!')
            //     }
            // })
            /*
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
            this.order.data.push(item)
            // 如果添加的款式 已经存在,则需要重新计算合并规则
            // if(this.current_style)
            // console.log(this.newItem.style)
            */
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
    },
    watch: {
        bDelete: function() {
            if (!this.bDelete) {
                console.log('变量发生改变 false')
                this.wannaDelete.data = []
            }
        }
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
