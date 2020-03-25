<template>
    <div>
        <Table :columns="columns" :data="titleData" border stripe />
    </div>
</template>
<script>
import { getComputersData } from '@/api/data'
export default {
    name: 'computer-state',
    components: {},
    data () {
        return {
            columns: [
                { title: '管理号', key: 'id', align: 'center' },
                { title: '当前订单', key: 'orderID', align: 'center' },
                { title: '当前使用文件名', key: 'filename', align: 'center' },
                { title: '当前状态', key: 'state', align: 'center' }
            ],
            titleData: []
        }
    },
    methods: {
    },
    mounted () {
        getComputersData().then(res => {
            this.titleData = res.data
        })
    }
}
</script>
