<template>
  <div>
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
    </Modal>
  </div>
</template>
<script>
export default {
    name: 'details',
    props: {},
    data() {
        return {
            // 控制model的开关显示
            bShowModel_details: false,
            // 交叉表数据
            Cloumns: [
                { title: '款式', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' }
            ],
            // 订单详情 details
            Data: [],
            // 尺码表
            sizeList: []
        }
    },
    methods: {
        exportExcel() {
            this.$refs.tables.exportCsv({
                filename: `table-${new Date().valueOf()}.csv`
            })
        },
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                return {
                    rowspan: row.step === 0 ? 0 : row.step,
                    colspan: row.step === 0 ? 0 : 1
                }
            }
        },
        handleEdit(row, index) {},
        ok() {},
        cancel() {}
    }
}
</script>
