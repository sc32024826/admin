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
        @on-delete="handleDelete"
        @on-selection-change="selectionChange"
        @on-new-info="addNewEmployee"
        @on-muti-delete="deleteMany"
        @on-save-edit="paramsEdit"
      />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <Drawer title="添加订单信息" v-model="drawer_new_em" width="500" :mask-closable="false">
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
        <Button style="margin: 8px" @click=" drawer_new_em= false">取消</Button>
        <Button type="primary" @click="employeeSubmit(formData)">提交</Button>
      </div>
    </Drawer>
    <Drawer title="批量删除订单" :closable="false" v-model="drawer_deleteMany" width="400">
      <h2 style="color:red">是否确认删除以下订单信息:</h2>
      <h3 v-for="item in selection" :key="item">{{item.id}}</h3>
      <div class="demo-drawer-footer">
        <Button style="margin: 8px" @click=" drawer_deleteMany= false">取消</Button>
        <Button type="primary" @click="deleteConfirm()">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderData } from '@/api/data'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: '60',
          align: 'center',
          key: 'sele'
        },
        { title: '订单号', key: 'id', sortable: true },
        { title: '客户名称', key: 'name', editable: true },
        { title: '订单日期', key: 'startDate', editable: true },
        { title: '交货日期', key: 'endDate', editable: true },
        { title: '订单详情', key: 'details', editable: true }
      ],
      tableData: [],
      drawer_new_em: false,
      drawer_deleteMany: false,
      formData: {
        id: '',
        name: '',
        department: ''
      },
      selection: [],
      allDepartment: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    // 选项改变时触发
    selectionChange (selection) {
      this.selection = selection
    },
    // 打开抽屉-新建员工
    addNewEmployee () {
      this.drawer_new_em = true
    },
    employeeSubmit (formData) {
      console.log('新增员工')
      console.log(formData)

      // axios
    },
    // 打开批量删除的抽屉
    deleteMany () {
      this.drawer_deleteMany = true
    },
    // 删除勾选项
    deleteConfirm () {
      // 勾选项 为 selection
      // 调用axios 删除 selection 匹配的数据
    },
    // 修改操作
    paramsEdit (params) {
      console.log(params)
      // 关键字段
      // params.row.id
      // 修改成
      // params.value

      // 调用axios 更新数据源
    }
  },
  mounted () {
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
