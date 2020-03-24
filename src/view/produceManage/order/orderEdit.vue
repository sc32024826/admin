<template>
    <div>
        <Drawer
            v-model="bShowOrder"
            title="订单详情"
            width="50%"
            :mask-closable="false"
            placement="left"
        >
            <Form :model="order">
                <Row :gutter="32">
                    <Col
                        span="12"
                        offset="6"
                        align="center"
                    >
                    <Input
                        v-model="order.name"
                        v-if="isEdit === true"
                    />
                    <h2 v-else>{{order.name}}</h2>
                    </Col>
                </Row>
                <Row
                    :gutter="32"
                    type="flex"
                    justify="space-between"
                >
                    <Col span="6">
                    <h4>订单号:{{order.id}}</h4>
                    </Col>
                    <Col
                        span="8"
                        align="right"
                    >
                    <DatePicker
                        v-model="order.startDate"
                        v-if="isEdit === true"
                    ></DatePicker>
                    <h4 v-else>订单日期:{{order.startDate}}</h4>
                    </Col>
                    <Col
                        span="8"
                        align="right"
                    >
                    <DatePicker
                        v-model="order.endDate"
                        v-if="isEdit === true"
                    ></DatePicker>
                    <h4 v-else>交货日期:{{order.endDate}}</h4>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem
                        label="订单详情"
                        label-position="top"
                    >
                        <!-- <Table :columns="orderColumns" :data="order.data" border :span-method="handleSpan"></Table> -->
                        <!-- <Details :data="order.data" @on-resultData="getNewData" /> -->
                        <Table
                            ref="tables"
                            :columns="columns"
                            :data="data"
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
                <Button
                    type="primary"
                    icon="ios-hammer"
                    @click="editDetails"
                    class="mr"
                >修改订单数量</Button>
                <Button
                    type="warning"
                    icon="md-checkmark"
                    v-if="isEdit === true"
                    @click="confirm()"
                >确认修改</Button>
            </div>
            <div class="demo-drawer-footer">
                <Button
                    style="margin-right: 8px"
                    @click="closeDrawer"
                >Cancel</Button>
                <Button
                    type="primary"
                    @click="value3 = false"
                >Submit</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
import Manage from './dataSourceAction'
import { getSize } from '@/api/utils'
import timeFormat from './time'

export default {
    name: 'order-edit',
    props: {
        value: Boolean,
        tableData: Object
    },
    data () {
        return {
            data: [],
            columns: [],
            isEdit: false,
            bShowOrder: false, // 控制本组件的显示与隐藏
            order: {}
        }
    },
    methods: {
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                return {
                    rowspan: row.step === 0 ? 0 : row.step,
                    colspan: row.step === 0 ? 0 : 1
                }
            }
        },
        editDetails () {
            if (this.isEdit) {
                this.$Message.warning('不要重复点击修改按钮')
            } else {
                this.isEdit = true
                console.log(this.order)
            }
        },
        // 确认修改按钮
        confirm () {
            this.isEdit = false
            // axios
            // 需要把时间格式重新转换成string格式
            console.log(this.order)
            let temp = this.order
            temp.startDate = timeFormat(temp.startDate)
            temp.endDate = timeFormat(temp.endDate)
            console.log(temp)
            // let startTime = this.order.startDate
            // let endTime = this.order.endDate
            // startTime = startTime.toString()
            // endTime = endTime.toString()
        },
        // data标识 tableData中的index
        remove (index) {
            this.tableData = this.tableData.filter((v, k) => k !== index)
            // 删除一行数据 之后 需要对表格规则重新  计算
            this.tableData = manage(this.tableData)
            console.log(this.tableData)
            // 需要把处理后的数据反馈给父组件
            this.returnData(this.tableData)
        },
        syncdata () {
            this.$emit('on-resultData', this.bShowOrder)
        },
        handleData (data) {
            let manageData = Manage(data.details) // 根据款式 获得带step数据
            console.log(manageData)
            this.data = manageData
            this.order = data
        },
        closeDrawer () {
            // console.log('3.关闭抽屉  false')
            // this.$store.commit('traggle')
            console.log('关闭抽屉')
            this.bShowOrder = false
        },
        getColumns () {
            this.columns = getColumns()
        }
    },
    computed: {},
    created () {
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
    },
    watch: {
        value (val) {
            this.bShowOrder = val
        },
        tableData (val) {
            this.handleData(val)
        },
        bShowOrder (val) {
            if (val !== this.value) {
                this.syncdata()
            }
        }
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
