<style lang="less">
@import "../../../styles/common.less";
@import "../../tables/components/table.less";
</style>

<template>
  <div>
      <Row>
           <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        可编辑单元行
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table2" v-model="editInlineData" :columns-list="editInlineColumns"></can-edit-table>
                    </div>
                </Card>
            </Col>
      </Row>
  </div>
</template>
<script>
import canEditTable from "../../tables/components/canEditTable.vue";
import tableData from "../../tables/components/table_data.js";
export default {
  name: "editable-table",
  components: {
    canEditTable
  },
  data() {
    return {
      editInlineColumns: [],
      editInlineData: []
    };
  },
  methods: {
    getData() {
      this.editInlineColumns = tableData.editInlineColumns;
      this.editInlineData = tableData.editInlineData;
    }
  },
  created() {
    this.getData();
  }
};
</script>
