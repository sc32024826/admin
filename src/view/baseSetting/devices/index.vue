<template>
    <div>
        <Table :loading="loading" :columns="columns" :data="titleData" border stripe />
    </div>
</template>

<script>
import { getDevicesData } from '@/api/data'
import getGroup from './getGroup'

export default {
    name: 'device-manage',
    components: {},
    data () {
        return {
            loading: true,
            columns: [
                { title: '分组', key: 'group', align: 'center' },
                { title: '设备号', key: 'id', align: 'center' },
                { title: 'IP地址', key: 'address', align: 'center' }
            ],
            titleData: []
        }
    },
    methods: {
    },
    mounted () {
        getDevicesData().then(res => {
            this.titleData = res.data
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
