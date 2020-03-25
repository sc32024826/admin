<template>
    <div>
        <Modal title="订单详情" v-model="bShowDetails">
            <Row>
                <Col span="12" offset="6" align="center">
                <h2>{{order.name}}</h2>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col span="6">
                <h4>订单号:{{order.id}}</h4>
                </Col>
                <Col span="8" align="right">
                <h4>订单日期:{{order.startDate}}</h4>
                </Col>
                <Col span="8" align="right">
                <h4>交货日期:{{order.endDate}}</h4>
                </Col>
            </Row>
            <Table :columns="columns" :data="data" border :span-method="handleSpan"></Table>
            <div class="demo-drawer-footer">
                <Button icon="md-download" :loading="exportLoading" @click="exportExcel_detail" disabled>导出为Csv文件</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Manage from './dataSourceAction'
import GenColumns from './getSizeColumns'

export default {
    name: 'order',
    props: {
        value: Boolean,
        tableData: Object
    },
    data () {
        return {
            bShowDetails: false, // 控制本组件的显示与隐藏
            data: [], // 本组件的表格数据
            columns: [], // 字段规则
            order: {},
            exportLoading: false
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
        syncData () {
            this.$emit('on-sync', this.bShowDetails)
        },
        // 数据源需要处理之后填入表中
        hanldeSourceData (data) {
            let manageData = Manage(data.details) // 根据款式 获得带step数据
            // console.log(manageData)
            this.data = manageData
            this.order = data
        },
        exportExcel_detail () { }
    },
    created () {
        this.columns = GenColumns()
    },
    watch: {
        value (val) {
            this.bShowDetails = val
        },
        tableData (val) {
            console.log('查看订单详情组件,数据源改变')
            // 当本组件不显示的时候不进行数据handle
            if (this.bShowDetails) {
                this.hanldeSourceData(val)
            } else {
                console.log('当本组件不显示的时候不进行数据handle')
            }
        },
        bShowDetails (val) {
            if (val !== this.value) {
                this.syncData()
            }
        }
    }
}
</script>
