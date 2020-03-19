<template>
  <div>
    <Tables
      ref="tables"
      stripe
      searchable
      search-place="top"
      v-model="devicesData"
      :columns="columns"
      @on-selection-change="selectionChange"
      @on-new-info="openModal_newItem"
      @on-muti-delete="deleteObject"
    />
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getDevicesData } from '@/api/data'

export default {
    name: 'device-manage',
    components: {
        Tables
    },
    data() {
        return {
            columns: [],
            devicesData: []
        }
    },
    methods: {
        selectionChange() {},
        openModal_newItem() {},
        deleteObject() {}
    },
    mounted() {
        getDevicesData().then(res => {
            this.devicesData = res.data
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
</style>
