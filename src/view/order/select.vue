<template>
  <div>
    <Modal v-model="addNewItem" :title="title" :open="addNewItem">
      <!-- <Form :model="newItem">
        <Row :gutter="32">
          <Col span="8">
            <FormItem label="款式" label-position="top">
              <Select
                v-model="current_style"
                filterable
                allow-create
                @on-create="handleCreate_style"
              >
                <Option
                  v-for="(item,index) in newItem.style"
                  :key="index"
                  :value="item.value"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="颜色" label-position="top">
              <Select
                v-model="current_color"
                filterable
                allow-create
                @on-create="handleCreate_color"
              >
                <Option
                  v-for="(item,index) in newItem.color"
                  :key="index"
                  :value="item.value"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="尺码" label-position="top">
              <Select v-model="current_size" filterable allow-create @on-create="handleCreate_size">
                <Option
                  v-for="(item,index) in newItem.size"
                  :key="index"
                  :value="item.value"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="数量" label-position="top"></FormItem>
            <Input v-model="newItem.count" placeholder="输入件数" />
          </Col>
        </Row>
      </Form>-->
    </Modal>
  </div>
</template>

<script>
export default {
    name: 'new-item',
    props: {
        // 需要接收的数据
        open: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            // 下拉选择器当前显示的内容
            current_style: '',
            current_color: '',
            current_size: '',
            newItem: {},
            addNewItem: false
        }
    },
    create: {
        // {Array}source 为订单详情数据
        // init(source) {
        //     // 定义一个数组 用于存放下拉选择器可选项的数组
        //     let styleli = []
        //     let colorli = []
        //     let size = [
        //         { value: 'XS' },
        //         { value: 'S' },
        //         { value: 'M' },
        //         { value: 'L' },
        //         { value: 'XL' }
        //     ]
        //     source.forEach(i => {
        //         !styleli.includes(i.style) ? styleli.push(i.style) : styleli
        //         !colorli.includes(i.color) ? colorli.push(i.color) : colorli
        //     })
        //     let style = []
        //     styleli.forEach((v, k) => {
        //         style.push({
        //             value: v
        //         })
        //     })
        //     let color = []
        //     colorli.forEach((v, k) => {
        //         color.push({
        //             value: v
        //         })
        //     })
        //     this.newItem = {
        //         style: style,
        //         color: color,
        //         size: size
        //     }
        // }
    },
    methods: {
        handleCreate_style() {
            console.log()
        },
        handleCreate_color(val) {
            console.log(val)
            console.log(sColor)
            // this.sColor.push()
        },
        handleCreate_size() {
            console.log()
        }
    },
    watch: {
        addNewItem: function() {
            console.log(this.addNewItem)
        }
    }
}
</script>
