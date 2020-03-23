<template>
  <div>
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
          <Col span="8" v-for="(item, index) in sizeMap" :key="index">
            <FormItem label="尺码" label-position="top" prop="size">
              <Select v-model="item.s" filterable>
                <Option v-for="(v,k) in newItem.size" :key="k" :value="v.value">{{v.value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="数量" label-position="top" prop="count">
              <Input v-model="item.v" placeholder="输入件数" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
