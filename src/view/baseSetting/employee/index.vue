<template>
    <div>
        <tables ref="tables" :loading="loading" stripe editable searchable search-place="top" v-model="tableData" :columns="columns" @on-selection-change="selectionChange" />
        <div class="bottom-button">
            <Button type="primary" icon="md-add" @click="drawer_new_em = true" class="mr">新增员工信息</Button>
            <Button type="error" icon="md-trash" @click="deleteObject()" class="mr">批量删除员工信息</Button>
            <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出为Csv文件</Button>
        </div>
        <Drawer title="新增员工信息" v-model="drawer_new_em" :mask-closable="false">
            <Form :model="formData">
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="工号" label-position="top">
                        <Input v-model="formData.id" placeholder="请输入员工工号" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="姓名" label-position="top">
                        <Input v-model="formData.name" placeholder="请输入员工姓名"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                    <FormItem label="部门" label-position="top">
                        <Select v-model="current_department" filterable>
                            <Option v-for="(item,index) in departmentList" :value="item.val" :key="index">{{item.val}}</Option>
                        </Select>
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
    </div>
</template>
<script>
import Tables from '_c/tables'
import { getEmployeeData } from '@/api/data'
import { dateFormat } from '@/api/utils'
import excel from '@/libs/excel'

export default {
    name: 'employee',
    components: { Tables },
    data () {
        return {
            loading: true,
            columns: [
                { type: 'selection', width: '60', align: 'center', key: 'sele' },
                { title: '工号', key: 'id', sortable: true },
                { title: '姓名', key: 'name' },
                { title: '部门', key: 'department' },
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
                                        props: { type: 'warning', size: 'small' },
                                        style: { 'margin-right': '4px' },
                                        on: {
                                            click: () => {
                                                this.editEmployeeInfo(params.row)
                                            }
                                        }
                                    },
                                    '编辑'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: { type: 'error', size: 'small' },
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
            drawer_new_em: false,
            bDelete: false,
            formData: {
                id: '',
                name: ''
            },
            selection: [],
            departmentList: [],
            // 当前选择的部门
            current_department: '',
            tableData: [],
            // 将要删除的内容
            wannaDelete: {
                columns: [
                    { title: '工号', key: 'id', align: 'center' },
                    { title: '姓名', key: 'name' }
                ],
                data: []
            },
            exportLoading: false
            // 分页
            // totalPage: 0
        }
    },
    methods: {
        // 计算所有人员的部门,罗列出部门数组,用于selection
        departmentAction () {
            let data = this.tableData
            let list = this.departmentList
            if (data) {
                data.forEach(v => {
                    !list.includes(v.department) ? list.push({ val: v.department }) : list
                })
            }
        },
        exportExcel () {
            if (this.tableData.length) {
                this.exportLoading = true
                let dataCopy = this.tableData.slice(0)
                // 遇到长数字 比如身份证时需要在数字前添加'\t' 否则cvs显示会异常
                dataCopy.forEach(v => {
                    v.id = '\t' + v.id
                })
                const params = {
                    title: ['工号', '姓名', '部门'],
                    key: ['id', 'name', 'department'],
                    data: dataCopy,
                    autoWidth: true,
                    filename: '员工表' + dateFormat('YYYY-mm-dd HH:MM', new Date())
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
            this.current_department

            // axios
            this.tableData.push({
                id: formData.id,
                name: formData.name,
                department: this.current_department
            })
            this.drawer_new_em = false
            this.current_department = ''
            formData = {}
        },
        // 打开批量删除的对话框
        deleteObject (data) {
            let needToDel = this.wannaDelete.data
            if (data) {
                this.bDelete = true
                console.log(data)
                needToDel.push({ id: data.id, name: data.name })
            } else {
                console.log(this.selection)

                let list = this.selection
                if (list.length) {
                    this.bDelete = true

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
        // 修改操作
        editEmployeeInfo (data) {
            console.log(data)
            // 关键字段
            // params.row.id
            // 修改成
            // params.value

            // 调用axios 更新数据源
        }
    },
    mounted () {
        getEmployeeData().then(res => {
            this.tableData = res.data
            this.departmentAction()
            this.loading = false
        })
    },
    watch: {
        bDelete: function () {
            if (!this.bDelete) {
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
