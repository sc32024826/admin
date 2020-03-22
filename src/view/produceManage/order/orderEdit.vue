<template>
  <div @on-resultData="returnData">
    <Drawer v-model="showOrder" title="订单详情" width="50%" :mask-closable="false" placement="left">
      <Form :model="order">
        <Row :gutter="32">
          <Col span="12" offset="6" align="center">
            <Input v-model="order.name" v-if="isEdit === true" />
            <h2 v-else>{{order.name}}</h2>
          </Col>
        </Row>
        <Row :gutter="32" type="flex" justify="space-between">
          <Col span="6">
            <h4>订单号:{{order.id}}</h4>
          </Col>
          <Col span="8" align="right">
            <DatePicker v-model="order.startDate" v-if="isEdit === true"></DatePicker>
            <h4 v-else>订单日期:{{order.startDate}}</h4>
          </Col>
          <Col span="8" align="right">
            <DatePicker v-model="order.endDate" v-if="isEdit === true"></DatePicker>
            <h4 v-else>交货日期:{{order.endDate}}</h4>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="订单详情" label-position="top">
              <!-- <Table :columns="orderColumns" :data="order.data" border :span-method="handleSpan"></Table> -->
              <!-- <Details :data="order.data" @on-resultData="getNewData" /> -->
              <Table
                ref="tables"
                :columns="columns"
                :data="order.details"
                border
                stripe
                :span-method="handleSpan"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <!-- <Button type="primary" @click="additem">添加条目</Button> -->
      <div class="bottom-button">
        <Button type="primary" icon="ios-hammer" @click="editDetails" class="mr">修改订单数量</Button>
        <Button type="warning" icon="md-checkmark" v-if="isEdit === true" @click="confirm()">确认修改</Button>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="closeDrawer">Cancel</Button>
        <Button type="primary" @click="value3 = false">Submit</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { getSize } from '@/api/utils'

export default {
    name: 'order-edit',
    props: {},
    data() {
        return {
            tableData: [],
            columns: [],
            isEdit: false
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
        editDetails() {
            if (this.isEdit) {
                this.$Message.warning('不要重复点击修改按钮')
            } else {
                this.isEdit = true
            }
        },
        confirm() {
            this.isEdit = false
            console.log(this.tableData)
            this.$emit('on-resultData', this.tableData)
            // axios
        },
        // data标识 tableData中的index
        remove(index) {
            this.tableData = this.tableData.filter((v, k) => k !== index)
            // 删除一行数据 之后 需要对表格规则重新  计算
            this.tableData = manage(this.tableData)
            console.log(this.tableData)
            // 需要把处理后的数据反馈给父组件
            this.returnData(this.tableData)
        },
        returnData(data) {
            this.$emit('on-resultData', data)
        },
        handleData(val) {
            this.bShow = val
        },
        closeDrawer() {
            // console.log('3.关闭抽屉  false')
            this.$store.commit('traggle')
        },
        getColumns() {
            this.columns = getColumns()
        }
    },
    computed: {
        showOrder() {
            // console.log(this.$store.state.bShow_order)
            return this.$store.state.bShow_order
        },
        order() {
            return this.$store.state.order
        }
    },
    created() {
        let that = this
        let sizeMap = getSize()
        that.sizeList = sizeMap
        that.columns = [
            { title: '款式', key: 'style', align: 'center' },
            { title: '颜色', key: 'color', align: 'center' }
        ]
        sizeMap.forEach(v => {
            that.columns.push({
                title: v,
                key: v,
                align: 'center',
                render: (h, params) => {
                    if (this.isEdit) {
                        return h('Input', {
                            props: { type: 'text', value: params.row[v] },
                            on: {
                                'on-blur': e => {
                                    params.row[v] = e.target.value
                                    console.log(params.index)
                                    this.tableData[params.index][v] =
                                        e.target.value
                                }
                            }
                        })
                    } else {
                        return h('span', {}, params.row[v])
                    }
                }
            })
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
.bottom-button {
    margin-top: 10px;
    margin-bottom: 10px;
}
.mr {
    margin-right: 10px;
}
</style>
