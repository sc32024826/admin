<template>
  <div>
    <Model v-model="bShowModel_details" title="订单详情" @on-ok="ok" @on-canccel="cancel">
      <Table :columns="Cloumns" :data="Data" border :span-method="handleSpan">
        <template slot-scope="{ row, index }" slot="style">
          <span>{{ row.style }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="color">
          <span>{{ row.color }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="XXS">
          <Input type="text" v-model="XXS" v-if="editIndex === true" />
          <span v-else>{{ row.XXS }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="XS">
          <Input type="text" v-model="XS" v-if="editIndex === true" />
          <span v-else>{{ row.XS }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="S">
          <Input type="text" v-model="S" v-if="editIndex === true" />
          <span v-else>{{ row.S }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="L">
          <Input type="text" v-model="L" v-if="editIndex === true" />
          <span v-else>{{ row.L }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="XL">
          <Input type="text" v-model="XL" v-if="editIndex === true" />
          <span v-else>{{ row.XL }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="XXL">
          <Input type="text" v-model="XXL" v-if="editIndex === true" />
          <span v-else>{{ row.XXL }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="XXXL">
          <Input type="text" v-model="XXXL" v-if="editIndex === true" />
          <span v-else>{{ row.XXXL }}</span>
        </template>
      </Table>
    </Model>

    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    <Button @click="handleEdit(row,index)">编辑数量</Button>
  </div>
</template>
<script>
export default {
    name: 'details',
    props: {},
    data() {
        return {
            // 控制model的开关显示
            bShowModel_details: false,
            // 交叉表数据
            Cloumns: [
                { title: '款式', key: 'style', align: 'center' },
                { title: '颜色', key: 'color', align: 'center' }
            ],
            // 订单详情 details
            Data: [],
            // 尺码表
            sizeList: []
        }
    },
    methods: {
        exportExcel() {
            this.$refs.tables.exportCsv({
                filename: `table-${new Date().valueOf()}.csv`
            })
        },
        // 交叉表 单元格格式规则, { row, cloumns, rowIndex, columnsIndex }
        handleSpan({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                return {
                    rowspan: row.step === 0 ? 0 : row.step,
                    colspan: row.step === 0 ? 0 : 1
                }
            }
        },
        handleEdit(row, index) {},
        ok() {},
        cancel() {}
    }
}
</script>
