<template>
    <div>
        <Modal ref="addNewLine" v-model="bShowModel_add" :title="title" :mask-closable="false" @on-ok="ok">
            <Form :model="newItem">
                <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="款式" label-position="top" prop="style">
                        <Input v-model="newItem.style" />
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="颜色" label-position="top" prop="color">
                        <Input v-model="newItem.color" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8" v-for="(item,index) in sizeMap" :key="index">
                    <FormItem label="尺码" label-position="top" prop="size">
                        <span>{{item.title}}</span>
                    </FormItem>
                    <FormItem label="数量" label-position="top" prop="count">
                        <Input v-model="newItem[item.title]" placeholder="输入件数" />
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
</template>
