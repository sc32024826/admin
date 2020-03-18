<template>
  <div>
    <tables
      ref="tables"
      stripe
      editable
      searchable
      search-place="top"
      v-model="tableData"
      :columns="columns"
      @on-selection-change="selectionChange"
      @on-new-info="addNewEmployee"
      @on-muti-delete="deleteObject"
    />
    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    <Drawer title="新增员工信息" v-model="drawer_new_em" width="720" :mask-closable="false">
      <Form :model="formData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="工号" label-position="top">
              <Input v-model="formData.id" placeholder="请输入员工工号" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="姓名" label-position="top">
              <Input v-model="formData.name" placeholder="请输入员工姓名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="部门" label-position="top">
              <Select v-model="current_department" filterable>
                <Option
                  v-for="(item,index) in departmentList"
                  :value="item.val"
                  :key="index"
                >{{item.val}}</Option>
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
    <Card>
      <Modal
        v-model="bDelete"
        title="您确认要删除以下内容吗?"
        @on-ok="confirmToDelete"
        @on-cancel="bDelete = false"
      >
        <Table :columns="wannaDelete.columns" :data="wannaDelete.data"></Table>
      </Modal>
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getEmployeeData } from '@/api/data'

export default {
    name: 'employee',
    components: { Tables },
    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: '60',
                    align: 'center',
                    key: 'sele'
                },
                { title: '工号', key: 'id', sortable: true },
                { title: '姓名', key: 'name' },
                { title: '部门', key: 'department' },
                {
                    title: '操作',
                    key: 'action',
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
                                        style: { 'margin-right': '2px' },
                                        on: {
                                            click: () => {
                                                this.editEmployeeInfo(
                                                    params.row
                                                )
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
            }
        }
    },
    methods: {
        // 计算所有人员的部门,罗列出部门数组,用于selection
        departmentAction() {
            let data = this.tableData
            let list = this.departmentList
            if (data) {
                data.forEach(v => {
                    !list.includes(v.department)
                        ? list.push({ val: v.department })
                        : list
                })
            }
            console.log(list)
        },
        exportExcel() {
            this.$refs.tables.exportCsv({
                filename: `table-${new Date().valueOf()}.csv`
            })
        },
        handleDelete(params) {
            console.log(params)
        },
        // 选项改变时触发
        selectionChange(selection) {
            this.selection = selection
        },
        // 打开抽屉-新建员工
        addNewEmployee() {
            this.drawer_new_em = true
        },
        employeeSubmit(formData) {
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
        // 打开批量删除的抽屉
        deleteObject(data) {
            this.bDelete = true
            let needToDel = this.wannaDelete.data
            if (data) {
                console.log(data)
                needToDel.push({ id: data.id, name: data.name })
            } else {
                console.log(this.selection)
                let list = this.selection
                list.forEach(v => {
                    needToDel.push({ id: v.id, name: v.name })
                })
            }
        },
        // 删除已选项
        confirmToDelete() {
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
        editEmployeeInfo(data) {
            console.log(data)
            // 关键字段
            // params.row.id
            // 修改成
            // params.value

            // 调用axios 更新数据源
        }
    },
    mounted() {
        getEmployeeData().then(res => {
            this.tableData = res.data
            this.departmentAction()
        })
    },
    watch: {
        bDelete: function() {
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
</style>
