<template>
    <div>
        <Tables :loading="loading" :columns="columns" v-model="tableData" border stripe searchable search-place="top" />
        <div class="bottom-button">
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
    </div>

</template>

<script>
import Tables from '_c/tables'
import { getDevicesData } from '@/api/data'
import excel from '@/libs/excel'
import getGroup from './getGroup'
import { dateFormat } from '@/api/utils'

export default {
    name: 'device-manage',
    components: { Tables },
    data () {
        return {
            loading: true,
            exportLoading: false,
            columns: [
                { title: '分组', key: 'group', align: 'center' },
                { title: '设备号', key: 'id', align: 'center' },
                { title: 'IP地址', key: 'address', align: 'center' }
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
                console.log(dataCopy)
                let params = {
                    title: ['分组', '设备号', 'IP地址'],
                    key: ['group', 'id', 'address'],
                    data: dataCopy,
                    autoWidth: true,
                    filename: '设备管理' + dateFormat('YYYY-mm-dd HH:MM', new Date())
                }
                excel.export_array_to_excel(params)
                this.exportLoading = false
            } else {
                this.$Message.info('表格数据不能为空！')
            }
        }
    },
    mounted () {
        getDevicesData().then(res => {
            this.tableData = res.data
            this.loading = false
        })
    },
    created () {
        let group = getGroup()
        console.log(group)
        let arr = []
        group.forEach((v, k) => {
            arr.push({
                label: v,
                value: k + 1
            })
        })
        console.log(arr)
        let temp = {
            title: '分组',
            key: 'group',
            align: 'center',
            filters: arr,
            filterMultiple: false,
            filterMethod (value, row) {
                switch (value) {
                    case 1:
                        return row.group === '100'
                    case 2:
                        return row.group === '101'
                    case 3:
                        return row.group === '102'
                    case 4:
                        return row.group === '103'
                    case 5:
                        return row.group === '104'
                }
            }
        }
        this.columns.shift()
        this.columns.unshift(temp)
        console.log(this.columns)
    }
}
</script>
