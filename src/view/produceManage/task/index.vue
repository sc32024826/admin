<template>
    <div>
        <Tables ref="tables" :loading="loading" :columns="columns" v-model="tableData" border stripe searchable search-place="top" :span-method="handleSpan" />
        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">
                <Page :total="dataCount" :current="currentPage" @on-change="changePage" @on-page-size-change="sizeSetter" show-sizer :page-size="pageSize"></Page>
            </div>
        </div>
        <div class="bottom-button">
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
    </div>
</template>

<script>
import Tables from '_c/tables'
import excel from '@/libs/excel'
import { getTaskData } from '@/api/data'
import { dateFormat } from '@/api/utils'
import DataFormat from './dataFormat'

export default {
    name: 'task-manage',
    components: { Tables },
    data () {
        return {
            exportLoading: false,
            loading: true,
            columns: [
                { title: '订单号', key: 'orderID', align: 'center' },
                { title: '款号', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' },
                { title: '尺码', key: 'size', align: 'center' },
                { title: '生产单号', key: 'proID', align: 'center' },
                { title: '上机文件名', key: 'filename', align: 'center' },
                { title: '数量', key: 'count', align: 'center' }
            ],
            tableData: [],
            // 分页相关属性
            totalData: [], // 未分页总数据
            dataCount: 0, // 表格数据量
            currentPage: 1, // 当前分页码
            pageSize: 10 // 每页显示数量
        }
    },
    methods: {
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan ({ row, cloumns, rowIndex, columnsIndex }) {
            // if (columnIndex === 0) {
            //     return {
            //         rowspan: row.orderStep === 0 ? 0 : row.orderStep,
            //         colspan: row.orderStep === 0 ? 0 : 1
            //     }
            // }
            // if (columnIndex === 1) {
            //     return {
            //         rowspan: row.styleStep === 0 ? 0 : row.styleStep,
            //         colspan: row.styleStep === 0 ? 0 : 1
            //     }
            // }
            // if (columnIndex === 2) {
            //     return {
            //         rowspan: row.colorStep === 0 ? 0 : row.colorStep,
            //         colspan: row.colorStep === 0 ? 0 : 1
            //     }
            // }
        },
        exportExcel () {
            if (this.tableData.length) {
                this.exportLoading = true
                let dataCopy = this.tableData.slice(0)
                // 遇到长数字比如身份证时需要在数字前添加'\t',否则cvs显示会异常
                // dataCopy.forEach(v => {
                //     v.id = '\t' + v.id
                // })
                var tit = []
                var key = []
                this.columns.forEach(e => {
                    tit.push(e.title)
                    key.push(e.key)
                })
                let params = {
                    title: tit,
                    key: key,
                    data: dataCopy,
                    autoWidth: true,
                    filename: '生产任务' + dateFormat('YYYY-mm-dd HH:MM', new Date())
                }
                excel.export_array_to_excel(params)
                this.exportLoading = false
            } else {
                this.$Message.info('表格数据不能为空！')
            }
        },
        // val 为新的页码
        changePage (val) {
            let _start = (val - 1) * this.pageSize
            let _end = val * this.pageSize
            this.tableData = this.totalData.slice(_start, _end)
            // temp = manage()
            // this.tableData = temp
        },
        // 设置每页显示数量
        sizeSetter (val) {
            this.pageSize = val
            // 修改每页显示数量之后 需要重新更新数据表
            this.tableData = this.totalData.slice(0, val)
        },
        // 表格数据分页处理
        pageData () {
            let data = []
            if (this.dataCount < this.pageSize) {
                data = this.totalData
            } else {
                data = this.totalData.slice(0, this.pageSize)
            }
            return DataFormat(data)
        }
    },
    mounted () {
        getTaskData().then(res => {
            this.totalData = res.data
            this.loading = false
            let length = res.data.length
            this.dataCount = length
            this.tableData = this.pageData()
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
