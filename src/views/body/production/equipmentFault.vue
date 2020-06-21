<template xmlns="">
  <div class="body">
    <!--搜索-->
    <div class="search">
      <el-button size="small" type="success" @click="allSave">保存</el-button>
    </div>
    <!--填充内容-->
    <div class="content">
      <div class="content-item">
        <transition name="van-slide-up">
          <ul>
            <li>
              故障开始时间：
              <el-date-picker
                  size="small" style="width: 200px;"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="list.RepairDate"
                  type="datetime"
                  placeholder="选择日期时间">
              </el-date-picker>
            </li>
            <li>
              设备故障类型：
              <el-select v-model="list.EmfaultId" size="small" style="width: 200px;" placeholder="请选择" clearable
                         filterable>
                <el-option
                    v-for="item in faultSelectList"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>
            <li>
              设备编码：
              <el-select v-model="list.EquipmentId" size="small" style="width: 200px;" placeholder="请选择" clearable
                         filterable>
                <el-option
                    v-for="item in equipmentSelectList"
                    :key="item.Id"
                    :label="item.Name+','+item.Id"
                    :value="item.Id">
                </el-option>
              </el-select>
            </li>

            <li>
              故障描述：
              <el-input v-model="list.RepairDescribe" size="small" style="width: 200px;" placeholder="请输入" clearable>
              </el-input>
            </li>
            <li>
              故障部位：
              <el-input v-model="list.RepairPlace" size="small" style="width: 200px;" placeholder="请输入" clearable>
              </el-input>
            </li>
            <li>
              故障原因：
              <el-input v-model="list.RepairReason" size="small" style="width: 200px;" placeholder="请输入" clearable>
              </el-input>
            </li>
            <li>
              是否加急：
              <el-select v-model="list.IsUrgent" size="small" style="width: 200px;" placeholder="请选择">
                <el-option label="不加急" :value="0"></el-option>
                <el-option label="加急" :value="1"></el-option>
              </el-select>
            </li>

          </ul>
        </transition>
      </div>
    </div>
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
        list: {
          IsUrgent: 0,
          PersonId: localStorage.getUser().PersonId,
        },
        show: false,
        equipmentSelectList: [],
        faultSelectList: [],
      }
    },
    created() {
      this.getEquipmentData()
    },
    methods: {
      getEquipmentData() {
        const paramSupplier = {
          Page: 1,
          PageSize: 500,
          Entity: {
            Parameter: null,
            Type: 6
          }
        };
        api.getbasicdataitem(this.$qs.stringify(paramSupplier)).then(res => {
          this.equipmentSelectList = res.data.Entities
        })
        const param = {
          Page: 1,
          PageSize: 500,
          Entity: {
            Parameter: null,
            Type: 7
          }
        };
        api.getbasicdataitem(this.$qs.stringify(param)).then(res => {
          this.faultSelectList = res.data.Entities
        })
      },
      allSave() {
        Dialog.confirm({
          title: '保存',
          message: '该操作将保存当前页的所有数据',
        })
            .then(() => {
              this.show = true;
              const param = this.list;
              api.addemrepairs(this.$qs.stringify((param))).then(res => {
                if (res.data.Success) {
                  Notify({type: 'primary', message: res.data.Message});
                  this.list = {
                    IsUrgent: 0,
                    PersonId: localStorage.getUser().PersonId,
                  };
                  this.show = false
                } else {
                  Notify({type: 'danger', message: res.data.Message});
                  this.show = false
                }
              })
            })
            .catch(() => {
              Notify({type: 'warning', message: '已取消操作'});
            });
      },

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

          .opt_top, .opt_right
            position absolute

          .opt_right
            right 10px
            bottom 10px
</style>
