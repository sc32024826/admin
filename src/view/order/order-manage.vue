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
      <h3 v-for="item in selection" :key="item">{{item.id}}</h3>
      <div class="demo-drawer-footer">
        <Button style="margin: 8px" @click=" drawer_deleteMany= false">取消</Button>
        <Button type="primary" @click="deleteConfirm()">确定</Button>
      </div>
    </Drawer>
    <Drawer title="修改订单信息:" :closable="false" v-model="drawer_editinfo" width="700">
      <Form :model="dbclickItem">
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="客户名称" label-position="top">
              <Input v-model="dbclickItem.name" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="订单日期" label-position="top">
              <DatePicker v-model="dbclickItem.startDate"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="交货日期" label-position="top">
              <DatePicker v-model="dbclickItem.endDate"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="订单详情" label-position="top">
              <!-- <Table
                :columns="crossTabCloumns"
                :data="crossTabData"
                border
                :span-method="handleSpan"
              ></Table>-->
            </FormItem>
          </Col>
        </Row>
      </Form>

      <div class="demo-drawer-footer">
        <Button style="margin: 8px" @click="drawer_editinfo= false">取消</Button>
        <Button type="primary" @click="confirmEdit(dbclickItem)">提交修改</Button>
      </div>
    </Drawer>
    <Table :columns="crossTabCloumns" :data="crossTabData" border :span-method="handleSpan"></Table>
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
      dbclickItem: {},
      // 交叉表数据
      crossTabCloumns: [
        { title: '款式', align: 'center' },
        { title: '颜色', align: 'center' },
        {
          title: '尺码',
          align: 'center',
          children: [
            { title: 'S', align: 'center' },
            { title: 'M', align: 'center' },
            { title: 'L', align: 'center' }
          ]
        }
      ],
      crossTabData: [
        {
          款式: 'A款',
          颜色: '黄色',
          尺码: 'S',
          数量: '3121'
        },
        {
          款式: 'A款',
          颜色: '黄色',
          尺码: 'M',
          数量: '1121'
        },
        {
          款式: 'A款',
          颜色: '黄色',
          尺码: 'L',
          数量: '1213'
        }
      ],
      Rules: []
    }
  },
  methods: {
    // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
    handleSpan ({ row, cloumns, rowIndex, columnsIndex }) {
      // A款 2行
      if (rowIndex === 0 && columnsIndex === 0) {
        return [2, 1]
      }
      if (rowIndex === 2 && columnsIndex === 0) {
        return [3, 1]
      }
    },
    showDeatils (params) {
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
    },
    // 打开抽屉修改 内容
    onRowClick (row) {
      // console.log(row)
      this.drawer_editinfo = true
      this.dbclickItem = row
      // 订单详情数据 object | row.details
      // console.log(row.details)

      // let ruleData = row.details[0]
      // let style = Object.keys(ruleData) // 数组  [A款,B款]
      // let styleCount = style.length // 款的数量
      // console.log('一共有' + styleCount + '个款式:' + style.toString())
      // let colorList = [] // 对应每个款式的 对应颜色 数组
      // let sizeList = [] // 所有尺码的数组

      // var color = []
      // var styleName = ''
      // var colorCount = 0
      // var sizeType = []
      // var sizeCount = 0
      // var RowCount = 0 //表格行数 即所有款式颜色累计
      // var rule = []
      // for (var item in ruleData) {
      //     color = Object.keys(ruleData[item]) //["黄色", "红色"]
      //     styleName = ruleData[item]
      //     colorList.push(color)

      //     for (let j in ruleData[item]) {
      //         RowCount += 1
      //         // 遍历所有款式 所有颜色的码号,将所有衣服的码添加进 数组 sizeList 中
      //         sizeType = Object.keys(ruleData[item][j]) // 码的数组
      //         sizeCount = sizeType.length
      //         console.log(j + ':' + sizeCount + '个尺码')
      //         colorCount += sizeType.length
      //         for (let k in sizeType) {
      //             if (sizeList.indexOf(sizeType[k]) < 0) {
      //                 sizeList.push(sizeType[k])
      //             }
      //         }
      //     }
      //     rule.push(RowCount) //将每个款式的颜色数量 送入数组中
      //     RowCount = 0 //置零
      // }
      // console.log(rule)
      // //console.log(sizeList) // 获得最终的columns 列 标题 即 所以码  ["S", "M", "L"]
      // let columnsCount = sizeList.length + 2 // 表格所有列数
      // // 设置 订单详情中 尺码表
      // // this.crossTabCloumns[2].children = this.translate(sizeList)
      // // 其中参数Row 决定了表格的布局规则
      // this.Rules = rule
    },
    // 订单修改提交
    confirmEdit (dbclickItem) {},

    // 将传递过来的数组 修改成 columns 数组参数
    translate (arr) {
      let objArr = []
      arr.forEach(element => {
        let obj = {}
        obj['title'] = element
        obj['align'] = 'center'
        objArr.push(obj)
      })
      return objArr
    }
  },
  mounted () {
    getOrderData().then(res => {
      this.tableData = res.data
      // this.crossTabData = this.tableData[0].details
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
