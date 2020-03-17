<template>
  <Drawer :title="title" :traggle="traggle" width="500" :mask-closable="false">
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
      <Button style="margin: 8px" @click="drawer_new_item= false">取消</Button>
      <Button type="primary" @click="submit(formData)">提交</Button>
    </div>
  </Drawer>
</template>
<script>
export default {
}
</script>
