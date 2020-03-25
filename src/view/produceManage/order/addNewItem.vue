<template>
    <div>
        <Modal v-model="bShowModel_add" :title="title" width="50%" :mask-closable="false">
            <Form :model="order">
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="客户名称:" label-position="top">
                        <Input v-model="order.name" placeholder="请输入客户名称" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32" type="flex" justify="space-between">
                    <Col span="12" align="right">
                    <FormItem label="订单日期:" label-position="top">
                        <DatePicker v-model="order.startDate" placeholder="请选择订单日期"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="12" align="right">
                    <FormItem label="交货日期:" label-position="top">
                        <DatePicker v-model="order.endDate" placeholder="请选择交货日期"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="订单详情" label-position="top">
                        <Table ref="tables" :columns="columns" :data="temp" border stripe />
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button icon="md-add" style="margin-right: 8px" @click="addLine">增加一行</Button>
                <Button icon="md-checkmark" type="primary" @click="submit">提交订单</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getSize } from '@/api/utils'
import timeFormat from './time'

export default {
    name: 'add-item',
    props: {
        value: Boolean,
        title: String
    },
    data () {
        return {
            bShowModel_add: false, // 控制本组件的开启和关闭
            order: {},
            sizeMap: [],
            columns: [],
            details: [], // 存放输入的订单详情数据
            lineData: {}, // 存放订单详情的单行数据
            col: [], // 存放字段名
            temp: [] // 存放临时订单详情数据
        }
    },
    methods: {
        syncData () {
            this.$emit('on-sync', this.bShowModel_add)
        },
        submit () {
            this.order.details = this.temp
            console.log(this.order)
            this.order.startDate = timeFormat(this.order.startDate)
            this.order.endDate = timeFormat(this.order.endDate)
            this.$emit('on-addOrder', this.order)
            // 数据提交之后,清空本组件数据
            this.clear()
        },
        addLine () {
            this.lineData = {} // 此处注意,必须清空
            let obj = {}
            this.col.forEach(e => {
                obj[e] = ''
            })
            this.temp.push(obj)
            console.log(obj)
            console.log(this.temp)
        },
        removeLine (params) {
            console.log(params.index)
            this.temp = this.temp.filter((v, k) => k !== params.index)
            console.log(this.temp)
        },
        // 输入框失去焦点时触发,e 为输入的值,val 为输入的字段名
        setValue (e, params, val) {
            let index = params.index
            this.lineData[val] = e
            this.temp[index] = this.lineData
            console.log('修改' + index + '行,' + val + '字段为:' + e)
            console.log('linedata:')
            console.log(this.lineData)
        },
        clear () {
            this.bShowModel_add = false
            this.order = {}
            this.sizeMap = []
            this.columns = []
            this.details = []
            this.lineData = {}
            this.col = []
            this.temp = []
        }
    },
    watch: {
        value (val) {
            this.bShowModel_add = val
        },
        bShowModel_add (val) {
            if (val !== this.val) {
                this.syncData()
            }
        }
    },
    created () {
        // this.sizeMap = getSize()
        let map = getSize()
        let col = ['style', 'color']
        map.forEach(i => {
            this.sizeMap.push({ title: i })
            col.push(i)
        })
        this.col = col
        col.forEach(val => {
            var t = val
            if (val === 'style') {
                t = '款式'
            } else if (val === 'color') {
                t = '颜色'
            }
            this.columns.push({
                title: t,
                key: val,
                align: 'center',
                render: (h, params) => {
                    return h('Input', {
                        props: {
                            type: 'text',
                            value: params.row[val]
                        },
                        on: {
                            'on-blur': e => {
                                if (e.target.value) {
                                    this.setValue(e.target.value, params, val)
                                }
                            }
                        }
                    })
                }
            })
        })
        this.columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
                return h('Button', {
                    props: {
                        type: 'error',
                        icon: 'ios-trash',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            this.removeLine(params)
                        }
                    }
                }, '删除')
            }
        })
        let obj = { style: '', color: '' }
        map.forEach(v => {
            obj[v] = ''
        })
        this.temp.push(obj)
    }
}
</script>
