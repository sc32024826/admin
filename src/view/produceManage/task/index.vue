<template>
    <div>
        <Tables ref="tables" :loading="loading" :columns="columns" v-model="tableData" border stripe searchable search-place="top" />
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

export default {
    name: 'task-manage',
    components: { Tables },
    data () {
        return {
            exportLoading: false,
            loading: true,
            columns: [
                { title: '订单号', key: 'orderID', align: 'center' },
                { title: '生产单号', key: 'proID', align: 'center' },
                { title: '款号', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' },
                { title: '尺码', key: 'size', align: 'center' },
                { title: '上机文件名', key: 'filename', align: 'center' },
                { title: '数量', key: 'count', align: 'center' }
            ],
            tableData: []
        }
    },
    methods: {
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
                console.log(dataCopy)
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
        }
    },
    mounted () {
        getTaskData().then(res => {
            this.tableData = res.data
            this.loading = false
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
