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
