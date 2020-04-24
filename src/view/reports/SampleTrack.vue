<template>
    <div>
        <div>
            <Form :model="condition">
                <RadioGroup v-model="condition">
                    <Radio label="待生产" border></Radio>
                    <Radio label="生产中" border default></Radio>
                    <Radio label="已完成" border></Radio>
                </RadioGroup><Button type="primary" class="selectBtn" @click="filtrate" icon="md-reorder">筛选</Button>
                <Button type="primary" class="selectBtn" @click="reset" icon="md-refresh">重置</Button>
            </Form>
        </div>
        <Tables ref="tables" :loading="loading" stripe searchable search-place="top" v-model="tableData" :columns="columns" />
        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">
                <Page :total="dataCount" :current="currentPage" @on-change="changePage" @on-page-size-change="sizeSetter" show-sizer :page-size="pageSize"></Page>
            </div>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables'

export default {
    name: 'SampleTrack',
    components: { Tables },
    data () {
        return {
            loading: false,
            columns: [
                { title: '版单号', key: 'SampleNO', align: 'center', fixed: 'left', width: 100 },
                { title: '款号', key: 'StyleNO', align: 'center', fixed: 'left', width: 100 },
                { title: '数量', key: 'Count', align: 'center', width: 100 },
                { title: '计划完成日期', key: 'PlanDate', align: 'center', width: 150 },
                { title: '客户', key: 'Customer', align: 'center', width: 100 },
                { title: '开单日期', key: 'BillDate', align: 'center', width: 100 },
                { title: '版样类别', key: 'SampleClass', align: 'center', width: 100 },
                { title: '针种', key: 'NeedleClass', align: 'center', width: 100 },
                { title: '做办师傅', key: 'Master', align: 'center', width: 100 },
                { title: '产品类别', key: 'ProductClass ', align: 'center', width: 100 },
                { title: '打样完成日期', key: 'CompleteDate', align: 'center', width: 150 },
                { title: '工艺员', key: 'Technologist', align: 'center', width: 100 },
                { title: '制版员', key: 'Design', align: 'center', width: 100 },
                { title: '工艺完成时间', key: 'TechComplateDate', align: 'center', width: 150 },
                { title: '制版完成时间', key: 'DesignComplateDate', align: 'center', width: 150 },
                { title: '横机下机时间', key: 'HJDate', align: 'center', width: 150 },
                { title: '横机完成数量', key: 'HJCount', align: 'center', width: 150 },
                { title: '套口完成时间', key: 'TKDate', align: 'center', width: 150 },
                { title: '套口完成数量', key: 'TKCount', align: 'center', width: 150 },
                { title: '洗水完成时间', key: 'XSDate', align: 'center', width: 150 },
                { title: '洗水完成数量', key: 'XSCount', align: 'center', width: 150 },
                { title: '后整完成时间', key: 'HZDate', align: 'center', width: 150 },
                { title: '后整完成数量', key: 'HZCount', align: 'center', width: 150 },
                { title: '脱期原因', key: 'BackReason', align: 'center', width: 100 },
                { title: '备注', key: 'Remark', align: 'center', width: 100 },
                { title: '状态', key: 'Status', align: 'center', fixed: 'right', width: 100 }
            ],
            tableData: [],
            totalData: [], // 未分页总数据
            dataCount: 0, // 表格数据量
            currentPage: 1, // 当前分页码
            pageSize: 10, // 每页显示数量
            totalData_bak: {}, // 结果集备份
            condition: '生产中'
        }
    },
    created () {
        console.log('初始化')
    },
    mounted () {
        // getReportsData().then(res => {
        //     this.totalData = res.data
        //     this.totalData_bak = res.data
        //     this.loading = false
        //     this.dataCount = res.data.length
        //     this.tableData = this.pageData(this.totalData)
        // })
    },
    methods: {
        // val 为新的页码
        changePage (val) {
            let _start = (val - 1) * this.pageSize
            let _end = val * this.pageSize
            this.tableData = this.totalData.slice(_start, _end)
        },
        // 表格数据分页处理
        pageData (total) {
            let data = []
            if (this.dataCount < this.pageSize) {
                data = total
            } else {
                data = total.slice(0, this.pageSize)
            }
            return data
        },
        // 设置每页显示数量
        sizeSetter (val) {
            this.pageSize = val
            // 修改每页显示数量之后 需要重新更新数据表
            this.tableData = this.totalData.slice(0, val)
        },
        // 重置筛选结果
        reset () {
            this.dataCount = this.totalData_bak.length
            this.tableData = this.pageData(this.totalData_bak)
        }
    }
}
</script>
