<template>
    <div>
        <div>
            <Form :model="condition">
                <Select v-model="condition.catgroy" style="width:200px">
                    <Option v-for="item in aCondition" :value="item.value" :key="item.value">{{ item.value }}</Option>
                </Select>
                <RadioGroup v-model="condition2">
                    <Radio label="当日" border></Radio>
                    <Radio label="昨天" border></Radio>
                    <Radio label="7天" border></Radio>
                    <Radio label="自定义" border></Radio>
                </RadioGroup>
                <DatePicker type="daterange" placement="bottom-end" placeholder="选择时间段" style="width: 200px" v-if="showme" v-model="condition.dateRange"></DatePicker>
                <Button type="primary" class="selectBtn" @click="filtrate">筛选</Button>
            </Form>

        </div>
        <Tables :columns="columns" v-model="tableData" border stripe :loading="loading" searchable search-place="top" />
        <div class="bottom-button">
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
    </div>
</template>

<script>
import { getReportsData } from '@/api/data'
import Tables from '_c/tables'
import excel from '@/libs/excel'
import { dateFormat } from '@/api/utils'

export default {
    name: 'report',
    components: { Tables },
    data () {
        return {
            loading: true,
            columns: [
                { title: '款号', key: 'style', align: 'center' },
                { title: '生产单号', key: 'proID', align: 'center' },
                { title: '订单号', key: 'orderID', align: 'center' },
                { title: '尺码', key: 'size', align: 'center' },
                { title: '数量', key: 'count', align: 'center' },
                { title: '小组', key: 'group', align: 'center' },
                { title: '员工', key: 'employee', align: 'center' },
                { title: '客户', key: 'guest', align: 'center' },
                { title: '机器号', key: 'meachine', align: 'center' },
                { title: '日期', key: 'date', align: 'center' }
            ],
            tableData: [],
            exportLoading: false,
            condition: {}, // 列表筛选条件
            aCondition: [{ value: '员工' }, { value: '机台' }, { value: '客户' }, { value: '订单' }], // 可筛选的内容
            showme: false, // 是否显示时间区间选择
            condition2: '' // 单选框选择的内容
        }
    },
    mounted () {
        getReportsData().then(res => {
            this.tableData = res.data
            this.loading = false
        })
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
        },
        // 按照条件筛选表格数据或者重新请求数据
        filtrate () {
            console.log(this.condition)
            console.log(this.condition2)
        }
    },
    watch: {
        condition2 (val) {
            if (val === '自定义') {
                this.showme = true
            } else {
                this.showme = false
            }
        }
    }
}
</script>
<style>
.selectBtn {
    margin-left: 2px;
}
</style>
