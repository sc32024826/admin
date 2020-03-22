<template>
  <div>
    <Table
      ref="tables"
      :columns="columns"
      :data="tableData"
      border
      stripe
      :span-method="handleSpan"
    />
    <div class="bottom-button">
      <Button type="primary" icon="ios-hammer" @click="editDetails" class="mr">修改订单数量</Button>
      <Button
        type="warning"
        icon="md-checkmark"
        v-if="isEdit === true"
        @click="confirmToSubmit()"
      >确认修改</Button>
    </div>
  </div>
</template>

<script>
import { getOrderData } from '@/api/data'
import { getSize } from '@/api/utils'
import manage from '../../produceManage/order/dataSourceAction'

export default {
    name: 'device-manage',
    components: {},
    data() {
        return {
            columns: [],
            tableData: [],
            isEdit: false,
            // 正要修改项的值
            sizeList: []
        }
    },
    methods: {
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                return {
                    rowspan: row.step === 0 ? 0 : row.step,
                    colspan: row.step === 0 ? 0 : 1
                }
            }
        },
        editDetails() {
            if (this.isEdit) {
                this.$Message.warning('不要重复点击修改按钮')
            } else {
                this.isEdit = true
            }
        },
        confirmToSubmit() {
            this.isEdit = false
            console.log(this.tableData)
            // axios
        }
    },
    mounted() {
        getOrderData().then(res => {
            let data = res.data[0].details
            this.tableData = manage(data)
            // console.log(this.tableData)
        })
    },
    created() {
        let that = this
        let sizeMap = getSize()
        that.sizeList = sizeMap
        that.columns = [
            { title: '款式', key: 'style', align: 'center' },
            { title: '颜色', key: 'color', align: 'center' }
        ]
        sizeMap.forEach(v => {
            that.columns.push({
                title: v,
                key: v,
                align: 'center',
                render: (h, params) => {
                    if (this.isEdit) {
                        return h('Input', {
                            props: { type: 'text', value: params.row[v] },
                            on: {
                                'on-blur': e => {
                                    params.row[v] = e.target.value
                                    console.log(params.index)
                                    this.tableData[params.index][v] = e.target.value
                                }
                            }
                        })
                    } else {
                        return h('span', {}, params.row[v])
                    }
                }
            })
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
