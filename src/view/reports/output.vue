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
                <Button type="primary" class="selectBtn" @click="filtrate" icon="md-reorder">筛选</Button>
            </Form>
        </div>
        <Tables :columns="columns" v-model="tableData" border stripe :loading="loading" searchable search-place="top" />
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
            aCondition: [{ value: '员工' }, { value: '机器号' }, { value: '客户' }, { value: '订单号' }], // 可筛选的内容
            showme: false, // 是否显示时间区间选择
            condition2: '', // 单选框选择的内容
            // 分页相关属性
            totalData: [], // 未分页总数据
            dataCount: 0, // 表格数据量
            currentPage: 1, // 当前分页码
            pageSize: 10 // 每页显示数量
        }
    },
    mounted () {
        getReportsData().then(res => {
            this.totalData = res.data
            this.loading = false
            this.dataCount = res.data.length
            this.tableData = this.pageData()
        })
    },
    methods: {
        exportExcel () {
            if (this.totalData.length) {
                this.exportLoading = true
                let dataCopy = this.totalData.slice(0)
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
            let col = this.condition.catgroy
            if (!col) {
                this.$Message.error('请选择筛选条件!')
                return
            }
            let date = this.condition2
            if (!this.condition2) {
                this.$Message.error('请选择日期!')
                return
            } else {
                switch (this.condition2) {
                    case '当日':
                        console.log('当日')
                        break
                    case '昨天':
                        console.log('昨天')
                        break
                    case '7天':
                        console.log('7天')
                        break
                    case '自定义':
                        if (this.condition.dateRange[0] === '') {
                            this.$Message.error('请选择日期范围!')
                            return
                        } else {
                            date = this.condition.dateRange
                        }
                        break
                }
            }

            let filterObj = {
                catgroy: col,
                date: date
            }
            // 更新字段排列
            this.updateColumns(col)
            // 更新tabledata 数据  注意日期格式 是否需要转换
            console.log(filterObj)
        },
        // 将筛选的字段 左移到最左边你
        updateColumns (selectCol) {
            var index = 0
            var item = {}
            this.columns.forEach((v, k) => {
                if (v.title === selectCol) {
                    index = k
                    item = v
                }
            })
            this.columns.splice(index, 1)
            this.columns.unshift(item)
        },
        // val 为新的页码
        changePage (val) {
            let _start = (val - 1) * this.pageSize
            let _end = val * this.pageSize
            this.tableData = this.totalData.slice(_start, _end)
        },
        // 表格数据分页处理
        pageData () {
            let data = []
            if (this.dataCount < this.pageSize) {
                data = this.totalData
            } else {
                console.log(this.totalData)
                data = this.totalData.slice(0, this.pageSize)
            }
            return data
        },
        // 设置每页显示数量
        sizeSetter (val) {
            this.pageSize = val
            // 修改每页显示数量之后 需要重新更新数据表
            this.tableData = this.totalData.slice(0, val)
        }
    },
    computed: {

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
