<template>
    <div>
        <tables ref="tables" stripe editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns" @on-delete="handleDelete" @on-selection-change="selectionChange" />
        <div class="bottom-button">
            <Button type="primary" icon="md-add" @click="drawer_new_em = true" class="mr">新建客户档案</Button>
            <Button type="error" icon="md-trash" @click="deleteObject()" class="mr">批量删除订单</Button>
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
        <Drawer title="添加客户信息" v-model="drawer_new_em" width="720" :mask-closable="false">
            <Form :model="formData">
                <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="客户简称" label-position="top">
                        <Input v-model="formData.nichen" placeholder="请输入客户简称" />
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="客户全称" label-position="top">
                        <Input v-model="formData.name" placeholder="请输入客户全称"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="联系人姓名" label-position="top">
                        <Input v-model="formData.contact" placeholder="请输入联系人姓名"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="联系人电话" label-position="top">
                        <Input v-model="formData.tel" placeholder="请输入联系人电话"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin: 8px" @click=" drawer_new_em= false">取消</Button>
                <Button type="primary" @click="employeeSubmit(formData)">提交</Button>
            </div>
        </Drawer>
        <Modal v-model="bDelete" title="您确认要删除以下内容吗?" @on-ok="confirmToDelete" @on-cancel="bDelete = false">
            <Table :columns="wannaDelete.columns" :data="wannaDelete.data"></Table>
        </Modal>
        <Modal v-model="bedit" title="客户信息修改" @on-ok="confirmToEdit">
            <Form :model="OBinfo">
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="客户简称" label-position="top">
                        <Input v-model="OBinfo.nichen" placeholder="请输入客户简称"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="客户全称" label-position="top">
                        <Input v-model="OBinfo.name" placeholder="请输入客户全称"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="联系人姓名" label-position="top">
                        <Input v-model="OBinfo.contact" placeholder="请输入联系人姓名"></Input>
                    </FormItem>
                    </Col>
                    <Col span="24">
                    <FormItem label="联系人电话" label-position="top">
                        <Input v-model="OBinfo.tel" placeholder="请输入联系人电话"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>

<script>
import Tables from '_c/tables'
import { getGuestData } from '@/api/data'
import { dateFormat } from '@/api/utils'
import excel from '@/libs/excel'

export default {
    name: 'tables_page',
    components: {
        Tables
    },
    data () {
        return {
            loading: true,
            columns: [
                { type: 'selection', width: '60', align: 'center', key: 'sele' },
                { title: '编号', key: 'id', sortable: true },
                { title: '客户简称', key: 'nichen' },
                { title: '客户全称', key: 'name' },
                { title: '联系人姓名', key: 'contact' },
                { title: '联系人电话', key: 'tel' },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return [h('Button',
                            {
                                props: { type: 'warning', size: 'small' },
                                style: { margin: '2px' },
                                on: {
                                    click: () => {
                                        this.editObject(params.row)
                                    }
                                }
                            }, '编辑'),
                        h('Button',
                            {
                                props: { type: 'error', size: 'small' },
                                style: { margin: '2px' },
                                on: {
                                    click: () => {
                                        this.deleteObject(params.row)
                                    }
                                }
                            }, '删除')
                        ]
                    }
                }
            ],
            tableData: [],
            drawer_new_em: false,
            bDelete: false,
            formData: {},
            selection: [],
            // 将要删除的内容
            wannaDelete: {
                columns: [
                    { title: '编号', key: 'id', align: 'center' },
                    { title: '客户简称', key: 'nichen' },
                    { title: '客户全称', key: 'name' }
                ],
                data: []
            },
            exportLoading: false,
            OBinfo: {},
            bedit: false
        }
    },
    methods: {
        handleDelete (params) {
            console.log(params)
        },
        exportExcel () {
            if (this.tableData.length) {
                this.exportLoading = true
                let dataCopy = this.tableData.slice(0)
                // 遇到长数字比如身份证时需要在数字前添加'\t',否则cvs显示会异常
                dataCopy.forEach(v => {
                    v.id = '\t' + v.id
                    v.tel = '\t' + v.tel
                })
                console.log(dataCopy)
                let params = {
                    title: ['编号', '客户简称', '客户全称', '联系人姓名', '联系人电话'],
                    key: ['id', 'nichen', 'name', 'contact', 'tel'],
                    data: dataCopy,
                    autoWidth: true,
                    filename: '客户表' + dateFormat('YYYY-mm-dd HH:MM', new Date())
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
        // 打开抽屉-新建员工
        addNewEmployee () {
            this.drawer_new_em = true
        },
        employeeSubmit (formData) {
            console.log('新增员工')
            console.log(formData)

            // axios
        },
        // 打开批量删除的对话框
        deleteObject (data) {
            let needToDel = this.wannaDelete.data
            console.log(data)
            if (data) {
                this.bDelete = true
                console.log(data)
                needToDel.push({
                    id: data.id,
                    nichen: data.nichen,
                    name: data.name
                })
            } else {
                console.log(this.selection)

                let list = this.selection
                if (list.length) {
                    this.bDelete = true

                    list.forEach(v => {
                        needToDel.push({
                            id: v.id,
                            nichen: v.nichen,
                            name: v.name
                        })
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
        // 修改操作
        editObject (params) {
            console.log(params)
            this.OBinfo = params
            this.bedit = true
        },
        confirmToEdit () {

        }
    },
    mounted () {
        getGuestData().then(res => {
            this.tableData = res.data
            this.loading = false
        })
    },
    watch: {
        bDelete: function () {
            if (!this.bDelete) {
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
