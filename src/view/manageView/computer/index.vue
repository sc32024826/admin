<template>
    <div>
        <tables :columns="columns" v-model="tableData" border stripe searchable search-place="top" />
    </div>
</template>

<script>
import Tables from '_c/tables'
import { getComputersData } from '@/api/data'

export default {
    name: 'computer-state',
    components: { Tables },
    data () {
        return {
            columns: [
                { title: '管理号', key: 'id', align: 'center' },
                { title: '当前订单', key: 'orderID', align: 'center' },
                { title: '当前使用文件名', key: 'filename', align: 'center' },
                { title: '当前状态', key: 'state', align: 'center' }
            ],
            tableData: []
        }
    },
    methods: {
    },
    mounted () {
        getComputersData().then(res => {
            this.tableData = res.data
        })
    }
}
</script>
