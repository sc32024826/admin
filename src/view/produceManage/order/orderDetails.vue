<template>
  <Card>
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
  </Card>
</template>
<script>
export default {}
</script>
