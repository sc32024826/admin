<template>
  <div>
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
