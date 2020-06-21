<template>
  <div class="main">
    <div class="content">
      <van-sticky>
        <van-nav-bar
          :title="this.$route.name"
          left-text="菜单"
          right-text="注销"
          @click-left="onClickLeft"
          @click-right="onClickRight"
          color="#fff"
        />
      </van-sticky>
      <router-view name="content"></router-view>
    </div>
    <!--左侧菜单-->
    <van-popup
        v-model="menuShow"
        class="left_menu"
        position="left"
        :style="{ height: '100%',width:'100%' }"
    >
      <div>
        <div class="menu_header dis_flex" @click="menuShow = false">
          <div>
            <img src="../../assets/img/laocai.jpg" alt="">
            <h2>{{user.PersonName}},您好</h2>
            <h2>请选择菜单</h2>
          </div>
        </div>
        <ul class="menu_list clearfloat" v-if="active === 'home'">
          <router-link
              tag="li"
              :to="item.path"
              class="border-bottom"
              v-for="(item,index) of stockRouteArr"
              :key="index"
              @click.native="closePopup"
          >
            <div>{{item.name}}
              <van-icon name="arrow"/>
            </div>
          </router-link>
        </ul>
        <ul class="menu_list clearfloat" v-if="active === 'desktop'">
          <router-link
              tag="li"
              :to="item.path"
              class="border-bottom"
              v-for="(item,index) of equipmentRouteArr"
              :key="index"
              @click.native="closePopup">
            <div>{{item.name}}
              <van-icon name="arrow"/>
            </div>
          </router-link>
        </ul>
        <ul class="menu_list clearfloat" v-if="active === 'gem'">
          <router-link
              tag="li"
              :to="item.path"
              class="border-bottom"
              v-for="(item,index) of qualityRouteArr"
               :key="index" @click.native="closePopup">
            <div>{{item.name}}
              <van-icon name="arrow"/>
            </div>
          </router-link>
        </ul>
        <ul class="menu_list clearfloat" v-if="active === 'points'">
          <router-link
              tag="li"
              :to="item.path"
              class="border-bottom"
              v-for="(item,index) of productionRouteArr"
               :key="index"
              @click.native="closePopup">
            <div>{{item.name}}
              <van-icon name="arrow"/>
            </div>
          </router-link>
        </ul>
        <div class="desc">Copyright &copy;2020 杭州集控科技</div>
      </div>

    </van-popup>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item replace to="/layout/purchaseArrival" icon="home-o" name="home">
        库存
      </van-tabbar-item>
      <van-tabbar-item replace to="/layout/waitingRepair" icon="desktop-o" name="desktop">
        设备
      </van-tabbar-item>
      <van-tabbar-item replace to="/layout/incomingInspectionReport" icon="gem-o" name="gem">
        质量
      </van-tabbar-item>
      <van-tabbar-item replace to="/layout/circulationCard" icon="points" name="points">
        生产过程
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import {Notify} from 'vant';
  import { Dialog } from 'vant';
  import localStorage from '../../api/localStorage'

  export default {
    name: "layout",
    data() {
      return {
        active: 'home',
        isLoading: false,
        menuShow: false,
        user:localStorage.getUser(),
        productionRouteArr: [
          {name: '流转卡查看', path: '/layout/circulationCard'},
          {name: '流转卡绑定', path: '/layout/circulationCardBind'},
          // {name: '任务绑定', path: '/layout/purchaseArrival'},
          {name: '补料申请单', path: '/layout/replenishment'},
          {name: '退料申请单', path: '/layout/rejectedMateria'},
          {name: '生产报工', path: '/layout/productionReport'},
          // {name: '外协发料单', path: '/layout/purchaseArrival'},
          // {name: '外协收料单', path: '/layout/purchaseArrival'},
          // {name: '生产执行进度查询', path: '/layout/purchaseArrival'},
          // {name: '设备报修进度表', path: '/layout/purchaseArrival'},
          // {name: '员工生产统计表', path: '/layout/purchaseArrival'},
          {name: '设备故障报修', path: '/layout/equipmentFault'},
        ],
        qualityRouteArr: [
          {name: '来料待检单报表', path: '/layout/incomingInspectionReport'},
          {name: '来料检验单', path: '/layout/incomingInspectionSheet'},
          {name: '首检单', path: '/layout/firstCheckList'},
          {name: '工序检验单', path: '/layout/processInspectionSheet'},
          {name: '产品终检单', path: '/layout/finalInspectionSheet'},
          // {name: '巡检单', path: '/layout/purchaseArrival'},
          // {name: '检验员当日检验统计', path: '/layout/purchaseArrival'},
          // {name: '生产报废明细查询', path: '/layout/purchaseArrival'},
        ],
        equipmentRouteArr: [
          {name: '待修设备报表', path: '/layout/waitingRepair'},
          {name: '维修单', path: '/layout/repairOrder'},
          // {name: '设备维修', path: '/layout/purchaseArrival'},
          {name: '设备保养', path: '/layout/equipmentMaintenance'},
          {name: '设备报废', path: '/layout/equipmentScrapped'},
          // {name: '维修进度查询', path: '/layout/purchaseArrival'},
          // {name: '配件领用查询', path: '/layout/purchaseArrival'},
          // {name: '保养统计', path: '/layout/purchaseArrival'},
        ],
        stockRouteArr: [
          {name: '采购到货单', path: '/layout/purchaseArrival'},
          {name: '采购入库单', path: '/layout/purchaseReceipt'},
          {name: '销售出库单', path: '/layout/salesOutbound'},
          {name: '库存调拨单', path: '/layout/inventoryTransfer'},
          {name: '库存盘点单', path: '/layout/inventoryCheck'},
          {name: '生产入库单', path: '/layout/productionStockIn'},
          {name: '其他出库单', path: '/layout/otherOutbound'},
          {name: '其他入库单', path: '/layout/otherStockIn'},
          {name: '现存量信息', path: '/layout/existing'},
          {name: '装箱单信息', path: '/layout/packingList'},
          {name: '生产领料单信息', path: '/layout/productionPicking'},
          // {name: '委外出库', path: '/layout/purchaseArrival'},
          // {name: '工序委外发料单', path: '/layout/purchaseArrival'},
          // {name: '工序委外收料单', path: '/layout/purchaseArrival'},
        ]
      }
    },
    created(){

    },
    methods: {
      onChange(index) {
        // console.log(this.active);
        // Notify({type: 'primary', message: this.active});
      },
      onClickLeft() {
        this.menuShow = true
      },
      onClickRight() {
        Dialog.confirm({
          title: '注销',
          message: '是否退出重新登录',
        }).then(() => {
          this.$router.push('/')
        }).catch(() => {
          Notify({ type: 'warning', message: '已取消操作' });
        });
      },
      closePopup() {
        this.menuShow = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  .main
    min-height 100%
    .content
      height 100%
    .left_menu
      margin-bottom 30px
      div
        position relative
        .menu_header
          height 200px
          background: linear-gradient(to right, #0770e0, #087ded)
          div
            height 135px
            text-align center
            img
              width 80px
              border-radius 50%
            h2
              margin-top 10px
              font-size 20px
              color #fff
        .menu_list
          text-align center
          color #666
          font-size 20px
          padding-bottom 31px
          li
            float left
            box-sizing border-box
            width 50%
            padding 10% 0
            margin-bottom -1px
            margin-right -1px
            border 1px solid #999
            overflow hidden
        .desc
          height 30px
          line-height 30px
          text-align center
          font-size 16px
          position absolute
          left 0
          right 0
          bottom 0
          background #fff
          color #777

</style>
