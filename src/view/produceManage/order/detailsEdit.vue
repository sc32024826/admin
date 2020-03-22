<template>
  <div @on-resultData="returnData">
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
        @click="confirm()"
      >确认修改</Button>
    </div>
  </div>
</template>

<script>
import { getSize } from '@/api/utils'
import manage from './dataSourceAction'

export default {
    /**
     *  这个组件 只需要接收一个有表格规则的数据 就可以修改详细的表格
     */
    name: 'details-edit',
    props: {
        data: {
            type: Array,
            default() {
                return ''
            }
        }
    },
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
        confirm() {
            this.isEdit = false
            console.log(this.tableData)
            this.$emit('on-resultData', this.tableData)
            // axios
        },
        // data标识 tableData中的index
        remove(index) {
            this.tableData = this.tableData.filter((v, k) => k !== index)
            // 删除一行数据 之后 需要对表格规则重新  计算
            this.tableData = manage(this.tableData)
            console.log(this.tableData)
            // 需要把处理后的数据反馈给父组件
            this.returnData(this.tableData)
        },
        returnData(data) {
            this.$emit('on-resultData', data)
        }
    },
    mounted() {
        console.log('组件details-edit创建完毕')
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
                    if (that.isEdit) {
                        return h('Input', {
                            props: { type: 'number', value: params.row[v] },
                            on: {
                                'on-blur': e => {
                                    params.row[v] = e.target.value
                                    that.tableData[params.index][v] = e.target.value
                                    console.log(e.target.value)
                                }
                            }
                        })
                    } else {
                        return h('span', {}, params.row[v])
                    }
                }
            })
        })
        that.columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
                return h(
                    'Button',
                    {
                        props: { type: 'error' },
                        on: {
                            click: () => {
                                this.remove(params.index)
                            }
                        }
                    },
                    '删除'
                )
            }
        })
    },
    watch: {
        data: function() {
            this.tableData = this.data
        }
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
