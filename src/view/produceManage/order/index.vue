<template>
    <div>
        <tables ref="tables" stripe editable searchable search-place="top" v-model="tableData" :columns="columns" @on-selection-change="selectionChange" />
        <Order v-model="bShow_Order" @on-sync="syncValue" :tableData="sourceData_info" />
        <OrderEdit v-model="bShow_OrderEdit" @on-resultData="syncValueByEdit" :tableData="sourceData_edit" @on-edit="dataEdit" />
        <Modal v-model="bShowDel" title="您确认要删除以下内容吗?" @on-ok="confirmToDelete()" @on-cancel="bShowDel = false">
            <Table :columns="wannaDelete.columns" :data="wannaDelete.data"></Table>
        </Modal>
        <ADDITEM v-model="bShowAdd" title="新增订单" @on-sync="syncAdd" @on-addOrder="addOrderSuccess" />
        <div class="bottom-button">
            <Button type="primary" icon="md-add" @click="addNewItem" class="mr">新增订单</Button>
            <Button type="error" icon="md-trash" @click="deleteObject()" class="mr">批量删除订单</Button>
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
    </div>
</template>

<script>
import Tables from '_c/tables'
import { getOrderData } from '@/api/data'
import excel from '@/libs/excel'
import Order from './order'
import OrderEdit from './orderEdit'
import ADDITEM from './addNewItem'

export default {
    name: 'tables_page',
    components: {
        Tables,
        Order,
        OrderEdit,
        ADDITEM
    },
    data () {
        return {
            columns: [
                {
                    type: 'selection',
                    width: '60',
                    align: 'center',
                    key: 'sele'
                },
                {
                    title: '订单号',
                    key: 'id',
                    sortable: true,
                    width: 150,
                    align: 'center'
                },
                { title: '客户名称', key: 'name' },
                { title: '订单日期', key: 'startDate' },
                { title: '交货日期', key: 'endDate' },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return [
                            h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: { margin: '4px' },
                                        on: {
                                            click: () => {
                                                this.showDetails(params.row)
                                            }
                                        }
                                    },
                                    '查看'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        style: { margin: '4px' },
                                        on: {
                                            click: () => {
                                                this.editOrder(params.row)
                                            }
                                        }
                                    },
                                    '修改'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: { type: 'error', size: 'small' },
                                        style: { margin: '4px' },
                                        on: {
                                            click: () => {
                                                this.deleteObject(params.row)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        ]
                    }
                }
            ],
            tableData: [], // 主页表格数据源
            exportLoading: false, // 下载按钮 载入状态
            bShow_Order: false, // 控制查看详情对话框
            sourceData_info: {}, // 订单对象
            sourceData_edit: {}, // 订单对象
            bShow_OrderEdit: false, // 控制编辑订单的抽屉开启关闭
            bShowDel: false, // 控制删除确认框
            bShowAdd: false, // 控制新增订单
            wannaDelete: {
                columns: [
                    { title: '订单号', key: 'id', width: 150, align: 'center' },
                    { title: '客户名称', key: 'name' }
                ],
                data: []
            }// 将要被删除的数据
        }
    },
    methods: {
        exportExcel () {
            if (this.tableData.length) {
                this.exportLoading = true
                let dataCopy = this.tableData.slice(0)
                // 遇到长数字比如身份证时需要在数字前添加'\t',否则cvs显示会异常
                dataCopy.forEach(v => {
                    v.id = '\t' + v.id
                })
                console.log(dataCopy)
                let params = {
                    title: ['订单号', '客户名称', '订单日期', '交货日期'],
                    key: ['id', 'name', 'startDate', 'endDate'],
                    data: dataCopy,
                    autoWidth: true,
                    filename: '订单表'
                }
                excel.export_array_to_excel(params)
                this.exportLoading = false
            } else {
                this.$Message.info('表格数据不能为空！')
            }
        },

        // 选项改变时触发
        selectionChange (selection) {
            this.selection = selection
        },
        // 显示详情页
        showDetails (data) {
            console.log('点击了显示详情按钮')
            console.log(data)
            this.bShow_Order = true // 显示
            this.sourceData_info = data // 数据源
        },
        syncValue (val) {
            this.bShow_Order = val
        },
        // 当子组件 order-edit ...
        syncValueByEdit (val) {
            this.bShow_OrderEdit = val
        },
        // 当add-item 子组件显示状态发生改变时,同步值
        syncAdd (val) {
            this.bShowAdd = val
        },
        // 子组件中的表格数据修改
        dataEdit (val) {
            console.log(val)
            // 在子组件中修改了数据源,此处最好查询数据并更新以刷新表单
            let temp = this.tableData
            temp.forEach(item => {
                if (item.id === val.id) {
                    console.log('匹配数据,修改')
                    // item = val
                    Object.assign(item, val)
                }
            })
            console.log(temp)
        },
        // 修改订单
        editOrder (data) {
            console.log('打开修改订单抽屉')
            console.log(data)
            // 需要备份一个order 对象 用以修改数据
            let bak = {}
            Object.assign(bak, data)
            console.log(bak)
            this.bShow_OrderEdit = true
            this.sourceData_edit = bak // 数据源
        },
        // 批量删除与单行删除
        deleteObject (data) {
            let needToDel = this.wannaDelete.data
            if (data) {
                this.bShowDel = true
                console.log(data)
                needToDel.push({ id: data.id, name: data.name })
            } else {
                console.log(this.selection)
                let list = this.selection
                if (list.length) {
                    this.bShowDel = true
                    list.forEach(v => {
                        needToDel.push({ id: v.id, name: v.name })
                    })
                } else {
                    this.$Message.warning('没有选择任何数据!')
                }
            }
        },
        // 删除已选项
        confirmToDelete () {
            let that = this
            // 勾选项 为 selection
            // 调用axios 删除 selection 匹配的数据
            // 数组
            let needToDel = that.wannaDelete.data
            // 删除完毕后之后更新数据源
            console.log(that.tableData)
            needToDel.forEach(v => {
                that.tableData = that.tableData.filter(item => item.id !== v.id)
            })

            // 清空wannaDelete.data
            that.wannaDelete.data = []
        },
        addNewItem () {
            this.bShowAdd = true
            console.log('打开新增订单的对话框')
        },
        addOrderSuccess (order) {
            console.log(order)
            this.tableData.push(order)
            console.log(this.tableData)
            // 当前操作有报错,后期调用数据库之后应该可以解决这个问题
        }
    },
    mounted () {
        getOrderData().then(res => {
            this.tableData = res.data
        })
    },
    watch: {
        bShowDel: function () {
            if (!this.bShowDel) {
                console.log('变量发生改变 false')
                this.wannaDelete.data = []
            }
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
