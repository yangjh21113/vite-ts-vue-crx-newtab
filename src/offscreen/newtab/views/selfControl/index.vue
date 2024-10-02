<template>
  <div class="self-control-page">
    <div class="page-header">
      <el-icon class="back-btn" @click="toHomePage"><ArrowLeft /></el-icon>
      <div>自律计划</div>
      <div class="header-btns">
        <el-icon @click="startAddPlan"><CirclePlusFilled /></el-icon>
      </div>
    </div>
    <div class="page-content">
      <el-calendar v-if="!allPlanList.length" v-model="curDate" />
      <div class="plan-list">
        <div v-for="(item, index) in allPlanList" :key="index" class="plan-card" @click="selectPlan(item)">
          <el-icon v-if="curSelfControlPlan && curSelfControlPlan.name == item.name" class="select-icon"><Flag /></el-icon>
          {{ item.name }}
          <div class="card-bottom">
            <el-icon @click="deletePlan(index)"><Delete /></el-icon>
            <el-icon @click="seeDetail(item)"><DataLine /></el-icon>
          </div>
        </div>
      </div>
      <div class="plan-detail-content">
        <div v-if="curSelectedItem" class="plan-detail-list">
          <div class="detail-list-header">
            <div class="title">{{ curSelectedItem.name }}</div>
            <div class="title">{{ curSelectedItem.startTime }}</div>
            <div class="title">{{ curSelectedItem.days }}</div>
          </div>
          <div v-for="(item, index) in [...curSelectedItem.list, totalItem]" :key="index" class="plan-item">
            <div class="label">{{ item.label }}</div>
            <template v-if="item.id !== 'total'">
              <div v-for="(checkItem, index) in item.checkList" :key="index" class="check-box-item" :class="{ 'is-today': checkIsToday(index) }">
                <el-checkbox v-model="checkItem.value" disabled />
              </div>
            </template>
            <template v-else>
              <div v-for="(checkItem, index) in item.checkList" :key="index" class="check-box-item total-item">
                {{ checkItem }}
              </div>
            </template>
          </div>
        </div>
        <div v-if="curSelectedItem" class="plan-detail-echarts-box">
          <div id="detailEchartsDom" class="echarts-dom"></div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="增加计划" width="400px" class="common-dialog add-plan-dialog">
      <div class="dialog-content">
        <div class="add-plan-box">
          <div class="plan-item">
            <div class="name">名称</div>
            <input v-model="addInfo.name" class="value" placeholder="请输入" />
          </div>
          <div class="plan-item">
            <div class="name">周期(天)</div>
            <input v-model="addInfo.days" class="value" placeholder="请输入" />
          </div>
          <div class="plan-item">
            <div class="name">开始时间</div>
            <el-date-picker v-model="addInfo.startTime" class="value" type="date" placeholder="选择开始时间" />
          </div>
          <div class="plan-item">
            <div class="name">结束时间</div>
            <el-date-picker v-model="endDate" disabled class="value" type="date" placeholder="选择开始时间" />
          </div>
          <div class="plan-item detail-item">
            <div class="name">
              <div>项目</div>
              <el-icon class="add-btn" @click="addDetailItem"><CirclePlusFilled /></el-icon>
            </div>
            <div class="value detail-list">
              <div v-for="(item, index) in addInfo.list" :key="index" class="detail-input-item">
                <input v-model="item.label" class="input-box" placeholder="请输入" />
                <el-icon class="remove-btn" @click="removeDetailItem(index)"><RemoveFilled /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <el-button class="confirm-btn" type="primary" @click="savePlan">增加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { StorageKey, getStorage, setStorage } from '@/common/utils/storage'
import { CirclePlusFilled, RemoveFilled, Delete, ArrowLeft, CollectionTag, DataLine, Flag } from '@element-plus/icons-vue'
import moment from 'moment'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const getDatesArray = (startDate: string, endDate: string) => {
  let datesArray = []
  let currentDate = moment(startDate)
  while (currentDate.isSameOrBefore(endDate)) {
    datesArray.push(currentDate.format('YYYY-MM-DD'))
    currentDate.add(1, 'days')
  }
  return datesArray
}

const initEcharts = () => {
  const { startTime, days, checkList } = totalItem.value
  const endTime = moment(startTime).add(days, 'day').format('YYYY-MM-DD')
  let xAxisData = getDatesArray(startTime, endTime)
  let myChart = echarts.init(document.getElementById('detailEchartsDom'))
  myChart.setOption({
    title: {
      text: '完成天数统计'
    },
    tooltip: {},
    xAxis: {
      data: xAxisData
    },
    yAxis: {},
    series: [
      {
        name: '个数',
        type: 'line',
        data: checkList
      }
    ]
  })
}

const curDate = ref(new Date())
const dialogVisible = ref(false)
const addInfo: any = ref({
  name: '',
  days: '7',
  startTime: new Date(),
  list: [
    {
      label: '',
      checkList: []
    }
  ]
})
const totalItem: any = ref({
  id: 'total',
  days: 0,
  label: '总计',
  checkList: []
})
const checkIsToday = (index: number) => {
  const { startTime, days } = curSelfControlPlan.value
  const diffDay = moment().diff(moment(startTime), 'day')
  return Number(diffDay) == Number(index)
}
const router = useRouter()
const toHomePage = () => {
  router.push({
    name: 'home'
  })
}
const startAddPlan = () => {
  dialogVisible.value = true
}
const endDate = computed(() => {
  if (!addInfo.value.startTime || !addInfo.value.days) {
    return ''
  }
  return moment(addInfo.value.startTime).add(addInfo.value.days, 'day')
})
const addDetailItem = () => {
  addInfo.value.list.push({
    label: '',
    checkList: []
  })
}
const curSelfControlPlan = ref()
const selectPlan = (item: any) => {
  curSelfControlPlan.value = item
  setStorage(StorageKey.CurSelfControlPlan, JSON.stringify(item))
}
const deletePlan = (index: number) => {
  allPlanList.value.splice(index, 1)
  setStorage(StorageKey.SelfControlPlanList, JSON.stringify(allPlanList.value))
}
const curSelectedItem = ref()
const seeDetail = (item: any) => {
  curSelectedItem.value = item
  totalItem.value.days = item.days
  totalItem.value.checkList = new Array(Number(item.days)).fill(0)
  const { list } = item
  list.forEach((listItem: any) => {
    const { checkList } = listItem
    checkList.forEach((checkListItem: any, checkListIndex: number) => {
      if (checkListItem.value) {
        totalItem.value.checkList[checkListIndex]++
      }
    })
  })
  nextTick(() => {
    initEcharts()
  })
}
const removeDetailItem = (index: number) => {
  if (addInfo.value.list.length <= 1) {
    return
  }
  addInfo.value.list.splice(index, 1)
}
const allPlanList: any = ref([])
const savePlan = () => {
  const { list, days, startTime, name } = addInfo.value
  if (!name || !list[0].label) {
    return
  }
  addInfo.value.startTime = moment(startTime).format('YYYY-MM-DD')
  list.forEach((item: any) => {
    item.checkList = []
    for (let i = 0; i < Number(days); i++) {
      item.checkList.push({
        id: i,
        value: false
      })
    }
  })
  allPlanList.value.unshift(addInfo.value)
  dialogVisible.value = false
  setStorage(StorageKey.SelfControlPlanList, JSON.stringify(allPlanList.value))
}
onMounted(async () => {
  const localSelfControlListStr = await getStorage(StorageKey.SelfControlPlanList)
  if (localSelfControlListStr) {
    allPlanList.value = JSON.parse(localSelfControlListStr) || []
  }
  if (allPlanList.value.length <= 0) {
    await setStorage(StorageKey.CurSelfControlPlan, '')
  }
  const localSelfControlStr = await getStorage(StorageKey.CurSelfControlPlan)
  if (localSelfControlStr) {
    curSelfControlPlan.value = JSON.parse(localSelfControlStr) || {}
  }
})
</script>
<style lang="scss" scoped>
.self-control-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px;
    flex-shrink: 0;
    .el-icon {
      cursor: pointer;
    }
    .header-btns {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
    }
  }
  .page-content {
    display: flex;
    flex-direction: column;
    padding: 12px;
    flex-grow: 1;
    overflow: auto;
    .plan-list {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 10px;
      height: auto;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;
      overflow: auto;
      flex-shrink: 0;
      transition: height 0.3s linear;

      .plan-card {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 100px;
        margin: 0 10px 10px 0;
        flex-shrink: 0;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        .select-icon {
          position: absolute;
          top: -8px;
          left: 0;
          color: red;
          font-size: 20px;
        }
        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 4px 10px;
          font-size: 14px;
          background: rgba(0, 0, 0, 0.04);
          color: rgba(0, 0, 0, 0.52);
          .el-icon {
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
    }
    .plan-detail-content {
      margin-top: 10px;
      flex-grow: 1;
      overflow: auto;
      .plan-detail-list {
        display: flex;
        flex-direction: column;
        border: 1px dashed rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        .detail-list-header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.02);
          .title {
            margin-right: 10px;
          }
        }
        .plan-item + .plan-item {
          border-top: 1px dashed rgba(0, 0, 0, 0.12);
        }

        .plan-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          .label {
            width: 40px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: rgba(0, 0, 0, 0.32);
            transition: width 0.2s;
          }
          :deep(.check-box-item) {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            &.is-today {
              .el-checkbox__inner {
                border-color: red;
              }
            }
            &.total-item {
              min-height: 42px;
              color: red;
            }
          }
          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
        }
      }
      .plan-detail-echarts-box {
        margin-top: 10px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        width: 100%;
        height: 300px;
        border-radius: 4px;
        .echarts-dom {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.add-plan-dialog {
  .dialog-content {
    display: flex;
    flex-direction: column;
    padding: 10px 24px;
    height: 400px;
    overflow: hidden;
    .add-plan-box {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      line-height: 32px;
      flex-grow: 1;
      overflow: auto;
      .plan-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 80px;
          flex-shrink: 0;
          .add-btn {
            margin-left: 4px;
            cursor: pointer;
          }
        }
        :deep(.value) {
          height: 32px;
          padding: 0 12px;
          flex-grow: 1;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          &.el-input {
            border: none;
            padding: 0;
          }
          &::placeholder {
            color: rgba(0, 0, 0, 0.32);
          }

          &.detail-list {
            display: flex;
            flex-direction: column;
            height: auto;
            .detail-input-item + .detail-input-item {
              border-top: 1px dashed rgba(0, 0, 0, 0.12);
            }
            .detail-input-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 32px;
              .input-box {
                flex-grow: 1;
                &::placeholder {
                  color: rgba(0, 0, 0, 0.32);
                }
              }
              .remove-btn {
                margin-left: 4px;
                cursor: pointer;
              }
            }
          }
        }
        &.detail-item {
          align-items: flex-start;
        }
      }
    }
    .confirm-btn {
      margin-top: 10px;
      flex-shrink: 0;
    }
  }
}
</style>
