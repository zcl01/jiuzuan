import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: '登录页',
      component: () => import('@/components/login')
    },
    {
      path: '/layout',
      name: '导航页',
      component: () => import('@/views/layout/layout'),
      children: [
        {
          path: '/layout/purchaseArrival',
          name: '采购到货单',
          components: {
            content: () => import('@/views/body/inventory/purchaseArrival'),
          }
        },
        {
          path: '/layout/purchaseReceipt',
          name: '采购入库单',
          components: {
            content: () => import('@/views/body/inventory/purchaseReceipt'),
          }
        },
        {
          path: '/layout/packingList',
          name: '装箱单信息',
          components: {
            content: () => import('@/views/body/inventory/packingList'),
          }
        },
        {
          path: '/layout/productionPicking',
          name: '生产领料单信息',
          components: {
            content: () => import('@/views/body/inventory/productionPicking'),
          }
        },
        {
          path: '/layout/salesOutbound',
          name: '销售出库单',
          components: {
            content: () => import('@/views/body/inventory/salesOutbound'),
          }
        },{
          path: '/layout/inventoryCheck',
          name: '库存盘点单',
          components: {
            content: () => import('@/views/body/inventory/inventoryCheck'),
          }
        },{
          path: '/layout/inventoryTransfer',
          name: '库存调拨单',
          components: {
            content: () => import('@/views/body/inventory/inventoryTransfer'),
          }
        },{
          path: '/layout/productionStockIn',
          name: '生产入库单',
          components: {
            content: () => import('@/views/body/inventory/productionStockIn'),
          }
        },{
          path: '/layout/otherOutbound',
          name: '其他出库单',
          components: {
            content: () => import('@/views/body/inventory/otherOutbound'),
          }
        },{
          path: '/layout/otherStockIn',
          name: '其他入库单',
          components: {
            content: () => import('@/views/body/inventory/otherStockIn'),
          }
        },{
          path: '/layout/inventorySurplus',
          name: '盘盈',
          components: {
            content: () => import('@/views/body/inventory/inventorySurplus'),
          }
        },{
          path: '/layout/existing',
          name: '现存量查询',
          components: {
            content: () => import('@/views/body/inventory/existing'),
          },
        },
        {
          path: '/layout/circulationCard',
          name: '流转卡',
          components: {
            content: () => import('@/views/body/production/circulationCard'),
          }
        },{
          path: '/layout/circulationCardMore',
          name: '流转卡过程',
          components: {
            content: () => import('@/views/body/production/circulationCardMore'),
          }
        },{
          path: '/layout/equipmentFault',
          name: '设备故障报修',
          components: {
            content: () => import('@/views/body/production/equipmentFault'),
          }
        },{
          path: '/layout/replenishment',
          name: '补料申请单',
          components: {
            content: () => import('@/views/body/production/replenishment'),
          }
        },{
          path: '/layout/rejectedMateria',
          name: '退料申请单',
          components: {
            content: () => import('@/views/body/production/rejectedMateria'),
          }
        },{
          path: '/layout/productionReport',
          name: '生产报工',
          components: {
            content: () => import('@/views/body/production/productionReport'),
          }
        },{
          path: '/layout/circulationCardBind',
          name: '流转卡绑定',
          components: {
            content: () => import('@/views/body/production/circulationCardBind'),
          }
        },{
          path: '/layout/firstCheckList',
          name: '首检单',
          components: {
            content: () => import('@/views/body/quality/firstCheckList'),
          }
        },{
          path: '/layout/incomingInspectionReport',
          name: '来料待检单报表',
          components: {
            content: () => import('@/views/body/quality/incomingInspectionReport'),
          }
        },{
          path: '/layout/incomingInspectionSheet',
          name: '来料检验单',
          components: {
            content: () => import('@/views/body/quality/incomingInspectionSheet'),
          }
        },{
          path: '/layout/processInspectionSheet',
          name: '工序检验单',
          components: {
            content: () => import('@/views/body/quality/processInspectionSheet'),
          }
        },{
          path: '/layout/finalInspectionSheet',
          name: '产品终检单',
          components: {
            content: () => import('@/views/body/quality/finalInspectionSheet'),
          }
        },{
          path: '/layout/waitingRepair',
          name: '待修设备报表',
          components: {
            content: () => import('@/views/body/equipment/waitingRepair'),
          }
        },{
          path: '/layout/repairOrder',
          name: '维修单',
          components: {
            content: () => import('@/views/body/equipment/repairOrder'),
          }
        },{
          path: '/layout/equipmentMaintenance',
          name: '设备保养',
          components: {
            content: () => import('@/views/body/equipment/equipmentMaintenance'),
          }
        },{
          path: '/layout/equipmentScrapped',
          name: '设备报废',
          components: {
            content: () => import('@/views/body/equipment/equipmentScrapped'),
          }
        },
      ]
    },
  ]
})
