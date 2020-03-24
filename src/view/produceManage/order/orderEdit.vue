<template>
    <div>
        <Drawer v-model="bShowOrder" title="订单详情" width="50%" :mask-closable="false" placement="left">
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
                        <Table ref="tables" :columns="columns" :data="order.details" border stripe :span-method="handleSpan" />
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button type="warning" icon="ios-hammer" @click="editDetails" class="mr">修改订单</Button>
                <Button icon="md-checkmark" type="error" style="margin-right: 8px" @click="confirm" v-if="isEdit === true">确认修改</Button>
                <Button icon="ios-undo" @click="closeDrawer">关闭界面</Button>

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
                this.columns.push({
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('Button', {
                            props: { type: 'error', size: 'small' },
                            on: {
                                click: () => {
                                    console.log('删除订单子项')
                                    this.removeItem(params.index)
                                }
                            }
                        }, '删除')
                    }
                })
            }
        },
        // 确认修改按钮
        confirm () {
            this.isEdit = false
            console.log(this.order)
            // axios
            // 需要把时间格式重新转换成yyyy-MM-dd格式
            let temp = this.order
            temp.startDate = timeFormat(temp.startDate)
            temp.endDate = timeFormat(temp.endDate)
            console.log(temp)
            this.removeAction()
            this.$emit('on-edit', temp)
        },
        removeItem (index) {
            let comp = this.order.details.filter((v, k) => k !== index)
            // 删除一行数据 之后 需要对表格规则重新  计算
            comp = Manage(comp)
            console.log(comp)
            this.order.details = comp
        },
        syncdata () {
            this.$emit('on-resultData', this.bShowOrder)
        },
        handleData (data) {
            console.log('handle')
            this.order = data
            let manageData = Manage(data.details) // 根据款式 获得带step数据
            console.log(manageData)
            this.order.details = manageData
        },
        closeDrawer () {
            // console.log('3.关闭抽屉  false')
            // this.$store.commit('traggle')
            console.log('关闭抽屉')
            this.bShowOrder = false
            if (this.isEdit === true) {
                // 需要把时间格式重新转换成yyyy-MM-dd格式
                let temp = this.order
                temp.startDate = timeFormat(temp.startDate)
                temp.endDate = timeFormat(temp.endDate)
                this.isEdit = false
            }
        },
        getColumns () {
            this.columns = getColumns()
        },
        // 删除表里边的操作字段
        removeAction () {
            let len = this.columns.length
            if (this.columns[len - 1].key === 'action') {
                console.log('移除操作按钮')
                this.columns.pop()
            }
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
                                    let t = this.order.details
                                    t[params.index][v] =
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
        // 关闭抽屉时
        bShowOrder (val) {
            if (val !== this.value) {
                this.syncdata()
            }
            if (!val) {
                this.removeAction()
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
