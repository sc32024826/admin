<template>
  <div>
    <Card>
      <tables
        ref="tables"
        stripe
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
        @on-selection-change="selectionChange"
        @on-save-edit="paramsEdit"
      />
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
export default {
    name: 'tables_page',
    components: {
        Tables
    },
    data() {
        return {
            columns: [],
            tableData: []
        }
    },
    methods: {}
}
</script>
