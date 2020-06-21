<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-input v-model="listPage.EquipmentId" style="width: 280px;" clearable placeholder="请扫入设备编码"
                size="small" @keyup.enter.native="getList"></el-input>
      <el-button size="small" type="primary" @click="handleFilter" :disabled="listPage.EquipmentId == null || listPage.EquipmentId === ''">搜索</el-button>
    </div>
    <van-divider>{{contentShow === false ? '请先扫入设备编码': '请查看、填写数据'}}</van-divider>
    <!--填充内容-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="content" v-if="contentShow">
      <div class="content-header">
        <el-button size="small" type="success" @click="handleSubmit">提交</el-button>
      </div>
      <div class="content-item">
        <ul>
          <li>设备：{{list.EquipmentName}}</li>
          <li>设备规格：{{list.EquipmentModel}}</li>
          <li>状态：{{list.EquipmentTatus === 0 ? '正常': list.EquipmentTatus === 1 ? '故障': list.EquipmentTatus === 2 ? '维修': list.EquipmentTatus === 3 ? '保养': '停用'}}</li>
          <li>报废原因：
            <el-input v-model="list.ScrapReason " style="width: 200px;" size="small" placeholder="请输入"></el-input>
          </li>
        </ul>
      </div>
    </van-pull-refresh>

    <van-overlay :show="show" class="dis_flex">
      <van-loading size="24px" vertical>请给我点时间...</van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import {Dialog, Notify} from 'vant';
  import {api} from '../../../api'
  import localStorage from '../../../api/localStorage'

  export default {
    data() {
      return {
        isLoading: false,
        total: null,
        list: null,
        show: false,
        contentShow: false,
        listPage: {
          EquipmentId: null,
        },
      }
    },
    created() {
      // this.getList();
    },
    methods: {
      handleFilter() {
        if (this.listPage.EquipmentId == null || this.listPage.EquipmentId === '') {
          Notify({type: 'warning', message: '请先扫入设备编码'});
        } else {
          this.getList()
        }
      },
      getList() {
        this.show = true;
        const param = {
          EquipmentId: this.listPage.EquipmentId
        };
        api.getemscrapitem(this.$qs.stringify(param)).then(res => {
          this.show = false;
          let data = res.data;
          if (data.Success === false) {
            Notify({type: 'danger', message: data.Message});
          } else {
            data.PersonId = localStorage.getUser().PersonId;
            data.CreatorId = localStorage.getUser().PersonId;
            data.ProductionDate  = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            this.list = data;
            this.contentShow = true;
          }
        })
      },
      onRefresh() {
        this.getList();
        this.isLoading = false;
      },
      handleSubmit() {
        Dialog.confirm({
          title: '提交',
          message: '该操作将提交当前数据',
        })
            .then(() => {
              const param = this.list
              api.addemscrap(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.contentShow = false
                  this.listPage.EquipmentId = null
                } else {
                  Notify({type: 'danger', message: res.data.Message});
                }
              })
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      }
    }
  }
</script>

<style scoped lang="stylus">
  .body
    box-sizing border-box
    min-height 100%
    margin-bottom 80px

    .search
      width 95%
      margin 10px auto 0
      display flex
      align-items center

    .content
      font-size 16px
      color #666
      margin 10px auto 0

      .content-header
        width 95%
        line-height 20px
        margin 5px auto

        ul
          color #333

          li
            margin-bottom 5px

      .content-item
        margin-bottom 30px
        overflow auto

        ul
          padding 10px
          border 1px solid #eee
          width 95%
          box-sizing border-box
          margin 0 auto 10px
          border-radius 15px
          box-shadow 2px 2px 2px #eee
          position relative

          li
            line-height 30px

          .opt_left, .opt_right
            position absolute
            top 10px

          .opt_left
            right 80px

          .opt_right
            right 10px
</style>
