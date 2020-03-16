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
        @on-open-details="showDeatils"
        @on-selection-change="selectionChange"
        @on-new-info="addNewEmployee"
        @on-muti-delete="deleteMany"
        @on-save-edit="paramsEdit"
        @on-row-dblclick="onRowClick"
      />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Drawer title="添加订单信息:" v-model="drawer_new_em" width="500" :mask-closable="false">
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
              <!-- <Input v-model="formData.tel" placeholder="请输入联系人电话"></Input> -->
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin: 8px" @click="drawer_new_em= false">取消</Button>
        <Button type="primary" @click="employeeSubmit(formData)">提交</Button>
      </div>
    </Drawer>
    <Drawer title="批量删除订单:" :closable="false" v-model="drawer_deleteMany" width="400">
      <h2 style="color:red">是否确认删除以下订单信息:</h2>
      <h3 v-for="item in selection" :key="item.id">{{item.id}}</h3>
      <div class="demo-drawer-footer">
        <Button style="margin: 8px" @click=" drawer_deleteMany= false">取消</Button>
        <Button type="primary" @click="deleteConfirm()">确定</Button>
      </div>
    </Drawer>
    <Modal
      v-model="bShowModel_details"
      title="订单详情"
      @on-ok="ok()"
      @on-canccel="that.bShowModel_details = false"
      width="90%"
    >
      <Form :model="order">
        <Row :gutter="32">
          <Col span="24">
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
              <Table :columns="orderCloumns" :data="orderData" border :span-method="handleSpan"></Table>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Button style="margin: 10px;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <Button type="warning" @click="handleEdit()">编辑数量</Button>
      <Button type="primary" style="margin: 10px;" @click="additem">添加条目</Button>
      <Modal v-model="bShowModel_add" title="添加条目">
        <Form :model="newItem">
          <Row :gutter="32">
            <Col span="8">
              <FormItem label="款式" label-position="top">
                <Select v-model="sStyle" filterable allow-create @on-create="handleCreate1">
                  <Option
                    v-for="(item,index) in newItem.style"
                    :key="index"
                    :value="item.value"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="颜色" label-position="top">
                <Select v-model="sColor" filterable allow-create @on-create="handleCreate1">
                  <Option
                    v-for="(item,index) in newItem.color"
                    :key="index"
                    :value="item.value"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="尺码" label-position="top">
                <Select v-model="sSize" filterable allow-create @on-create="handleCreate1">
                  <Option
                    v-for="(item,index) in newItem.size"
                    :key="index"
                    :value="item.value"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="数量" label-position="top"></FormItem>
              <Input v-model="newItem.count" placeholder="输入件数" />
            </Col>
          </Row>
        </Form>
      </Modal>
    </Modal>
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
                { title: '交货日期', key: 'endDate' }
            ],
            tableData: [],
            drawer_new_em: false,
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
                sizeList: []
            },
            // 交叉表数据
            orderCloumns: [
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
            newItem: {
                style: '',
                color: '',
                size: '',
                count: ''
            },
            // 下拉选择器
            sStyle: '',
            sColor: '',
            sSize: ''
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
        showDeatils(params) {
            console.log(params)
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
        // 打开抽屉-新建员工
        addNewEmployee() {
            this.drawer_new_em = true
        },
        employeeSubmit(formData) {
            console.log('新增员工')
            console.log(formData)

            // axios
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
            let newColumns = that.manageData.sizeList // 新的尺码表
            // 重新生成尺码表
            that.orderCloumns = reGenrateColumns(newColumns)
            // 添加 操作按钮
            that.orderCloumns.push({
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
            let source = this.manageData
            let styleli = []
            let colorli = []
            let size = [
                { value: 'XS' },
                { value: 'S' },
                { value: 'M' },
                { value: 'L' },
                { value: 'XL' }
            ]

            source.data.forEach(i => {
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
        handleCreate1() {}
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
