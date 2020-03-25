<template>
    <div>
        <Table ref="tables" :columns="columns" :data="tableData" border stripe />
    </div>
</template>

<script>
import { getTaskData } from '@/api/data'

export default {
    name: 'task-manage',
    components: {},
    data () {
        return {
            columns: [
                { title: '订单号', key: 'orderID', align: 'center' },
                { title: '生产单号', key: 'proID', align: 'center' },
                { title: '款号', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' },
                { title: '尺码', key: 'size', align: 'center' },
                { title: '上级文件名', key: 'filename', align: 'center' },
                { title: '数量', key: 'count', align: 'center' }
            ],
            tableData: []
        }
    },
    methods: {
    },
    mounted () {
        getTaskData().then(res => {
            this.tableData = res.data
        })
    }
}
</script>
