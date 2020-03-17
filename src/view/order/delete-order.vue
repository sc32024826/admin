<template>
  <Drawer title="批量删除订单:" :closable="false" v-model="drawer_deleteMany" width="400">
    <h2 style="color:red">是否确认删除以下订单信息:</h2>
    <h3 v-for="item in selection" :key="item.id">{{item.id}}</h3>
    <div class="demo-drawer-footer">
      <Button style="margin: 8px" @click=" drawer_deleteMany= false">取消</Button>
      <Button type="primary" @click="deleteConfirm()">确定</Button>
    </div>
  </Drawer>
</template>
<script>
export default {}
</script>
