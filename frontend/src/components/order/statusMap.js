/**
 * 订单状态文案映射 —— 原站模块 `c646d`
 *
 * 结构：ORDER_STATUS_MAP[order_type][order_status] = {
 *   title, icon, text, textColor, tips, tipsColor, process
 * }
 * 原站为多语言 key（title / tips / process 走 handleLang），
 * 本复刻为中文环境，直接取中文文案。
 */

/** order_type = 1（普通藏品订单） */
const TYPE_1 = {
  2: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: 'main-text',
    process: '转入成功'
  },
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'success',
    tipsColor: 'warning',
    process: '等待支付'
  },
  7: {
    title: '藏品转入中',
    icon: 'order-success',
    text: '转入中',
    tips: '正在转入',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '支付成功,转入中'
  },
  3: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '订单取消'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text'
  },
  6: {
    title: '已退款',
    icon: 'order-cancel',
    text: '已退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text'
  }
}

/** order_type = 19（转赠订单） */
const TYPE_19 = {
  2: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: 'main-text',
    process: '转入成功'
  },
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'success',
    tipsColor: 'warning',
    process: '等待支付'
  },
  7: {
    title: '藏品转入中',
    icon: 'order-success',
    text: '转入中',
    tips: '正在转入',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '支付成功,转入中'
  },
  3: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '订单取消'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'successt',
    tipsColor: 'main-text'
  },
  6: {
    title: '已退款',
    icon: 'order-cancel',
    text: '已退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text'
  }
}

/** order_type = 2（市场订单） */
const TYPE_2 = {
  2: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: 'main-text',
    process: '转入成功'
  },
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'success',
    tipsColor: 'warning',
    process: '等待支付'
  },
  7: {
    title: '藏品转入中',
    icon: 'order-success',
    text: '转入中',
    tips: '正在转入',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '支付成功,转入中'
  },
  3: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text',
    process: '取消成功'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text'
  },
  6: {
    title: '已退款',
    icon: 'order-cancel',
    text: '已退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: 'main-text'
  }
}

/** order_type = 3（空投） */
const TYPE_3 = {
  2: {
    title: '空投转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: '999',
    process: '转入成功'
  },
  1: { process: '等待支付' },
  7: { process: '支付成功,转入中' },
  3: {}
}

/** order_type = 4（普通订单） */
const TYPE_4 = {
  2: {
    title: '订单完成',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: '999',
    process: '转入成功'
  },
  1: { process: '等待支付' },
  7: { process: '支付成功,转入中' },
  3: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    process: '取消成功',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: '999'
  }
}

/** order_type = 5 / 6 / 7（转入类） */
const TYPE_TRANSFER = {
  2: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: '999',
    process: '转入成功'
  },
  1: { process: '等待支付' },
  7: { process: '支付成功,转入中' },
  3: {}
}

/** order_type = 8（寄售 / 市场卖出） */
const TYPE_8 = {
  2: {
    title: '藏品已售出,结算成功',
    icon: 'market-submit',
    text: '已出售，结算成功',
    textColor: 'success',
    tips: '',
    tipsColor: '',
    process: '已出售，结算成功'
  },
  1: {
    title: '寄售成功',
    icon: 'js-success',
    text: '寄售成功',
    textColor: 'success',
    tips: '',
    tipsColor: '',
    process: '寄售成功'
  },
  7: {
    title: '锁单中',
    icon: 'order-lock',
    text: '锁单中',
    textColor: 'success',
    tips: '',
    tipsColor: '',
    process: '锁定中'
  },
  3: {
    title: '订单取消',
    icon: 'qx-success',
    process: '取消成功',
    text: '订单取消',
    textColor: 'warning',
    tips: '',
    tipsColor: ''
  }
}

/** order_type = 10（批量付） */
const TYPE_10 = {
  2: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    textColor: 'success',
    tips: '可前往我的藏品中查看',
    tipsColor: '999',
    process: '转入成功'
  },
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'black',
    tipsColor: 'warning',
    process: '等待支付'
  },
  7: {
    title: '藏品转入中',
    icon: 'order-success',
    text: '转入中',
    tips: '正在转入',
    textColor: 'success',
    tipsColor: '999',
    process: '支付成功,转入中'
  },
  3: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: '999',
    process: '取消成功'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: '999'
  },
  6: {
    title: '已退款',
    icon: 'order-cancel',
    text: '已退款',
    tips: 'updatetime',
    textColor: 'success',
    tipsColor: '999'
  }
}

/** order_type = 11（求购订单） */
const TYPE_11 = {
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '等待支付'
  },
  2: {
    title: '委托中',
    icon: 'order-cancel',
    text: '委托中',
    tips: '正在委托中，请耐心等待',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '支付成功，委托中'
  },
  3: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    tips: '可前往我的藏品中查看',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '转入成功'
  },
  4: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '订单已取消'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '待退款'
  },
  6: {
    title: '退款成功',
    icon: 'order-success',
    text: '退款成功',
    tips: '',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '退款成功'
  },
  7: {
    title: '订单生成中',
    icon: 'order-cancel',
    text: '订单生成中',
    tips: '订单生成中，请耐心等待',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '支付成功，订单生成中'
  },
  8: {
    title: '退款失败',
    icon: 'order-cancel',
    text: '退款失败',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '退款失败'
  }
}

/** order_type = 31（委托订单） */
const TYPE_31 = {
  1: {
    title: '待付款',
    icon: 'order-await',
    text: '待支付',
    tips: '支付倒计时',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '等待支付'
  },
  2: {
    title: '求购中',
    icon: 'order-cancel',
    text: '求购中',
    tips: '正在求购中，请耐心等待',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '支付成功，求购中'
  },
  3: {
    title: '藏品转入成功',
    icon: 'order-success',
    text: '转入成功',
    tips: '可前往我的藏品中查看',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '转入成功'
  },
  4: {
    title: '订单已取消',
    icon: 'qx-success',
    text: '已取消',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '订单已取消'
  },
  5: {
    title: '待退款',
    icon: 'order-cancel',
    text: '待退款',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '待退款'
  },
  6: {
    title: '退款成功',
    icon: 'order-success',
    text: '退款成功',
    tips: '',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '退款成功'
  },
  7: {
    title: '订单生成中',
    icon: 'order-cancel',
    text: '订单生成中',
    tips: '订单生成中，请耐心等待',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '支付成功，订单生成中'
  },
  8: {
    title: '退款失败',
    icon: 'order-cancel',
    text: '退款失败',
    tips: 'updatetime',
    textColor: 'main-text',
    tipsColor: 'warning',
    process: '退款失败'
  }
}

export const ORDER_STATUS_MAP = {
  1: TYPE_1,
  19: TYPE_19,
  2: TYPE_2,
  3: TYPE_3,
  4: TYPE_4,
  5: TYPE_TRANSFER,
  6: TYPE_TRANSFER,
  7: TYPE_TRANSFER,
  8: TYPE_8,
  10: TYPE_10,
  11: TYPE_11,
  31: TYPE_31
}

export default ORDER_STATUS_MAP
