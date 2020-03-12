import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/base_setting',
    name: '基础设置',
    meta: {
      icon: 'md-settings',
      title: '基础设置'
    },
    component: Main,
    children: [
      {
        path: 'employee',
        name: '人员管理',
        meta: {
          icon: 'md-people',
          title: '人员管理'
        },
        component: () => import('@/view/components/tables/tables.vue')
      },
      {
        path: 'organization',
        name: '组织架构管理',
        meta: {
          icon: 'md-podium',
          title: '组织架构管理'
        },
        component: () => import('@/view/components/org-tree')
      },
      {
        path: 'guest_manage',
        name: '客户管理',
        meta: {
          icon: 'md-contacts',
          title: '客户管理'
        },
        component: () => import('@/view/components/drag-list/drag-list.vue')
      },
      {
        path: 'device_manage',
        name: '设备管理',
        meta: {
          icon: 'ios-desktop',
          title: '设备管理'
        },
        component: () => import('@/view/components/drag-drawer')
      },
    ]
  },
  {
    path: '/produce_manage',
    name: '生产管理',
    meta: {
      icon: 'md-cloud-upload',
      title: '生产管理'
    },
    component: Main,
    children: [
      {
        path: 'order_manage',
        name: '订单管理',
        meta: {
          icon: 'ios-document',
          title: '订单管理'
        },
        component: () => import('@/view/update/update-table.vue')
      },
      {
        path: 'mission',
        name: '生产任务',
        meta: {
          icon: 'md-clipboard',
          title: '生产任务'
        },
        component: () => import('@/view/update/update-paste.vue')
      }
    ]
  },
  {
    path: '/report',
    name: '统计报表',
    meta: {
      icon: 'ios-stats',
      title: '统计报表'
    },
    component: Main,
    children: [
      {
        path: 'production_report',
        name: '产量报表',
        meta: {
          icon: 'md-stats',
          title: '产量报表'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'none',
        name: 'none',
        meta: {
          icon: 'md-close',
          title: 'none'
        }
      }
    ]
  },
  {
    path: '/manage_view',
    name: '管理看板',
    meta: {
      icon: 'ios-pie',
      title: '管理看板'
    },
    component: Main,
    children: [
      {
        path: 'computer_state',
        name: '电脑机实时状态',
        meta: {
          icon: 'md-pulse',
          title: '电脑机实时状态',
        },
        component: () => import('@/view/tools-methods/tools-methods.vue')
      },
      {
        path: 'none',
        name: 'none',
        meta: {
          icon: 'md-close',
          title: 'none'
        },

      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
