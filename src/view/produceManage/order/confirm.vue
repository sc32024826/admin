<Modal
      v-model="bDelete"
      title="您确认要删除以下内容吗?"
      @on-ok="confirmToDelete()"
      @on-cancel="bDelete = false"
    >
      <Table :columns="wannaDelete.columns" :data="wannaDelete.data"></Table>
    </Modal>
