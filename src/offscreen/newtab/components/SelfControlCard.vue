<template>
  <div class="self-control-card-box">
    <div class="card-header">
      <div class="header-left">
        <el-icon v-if="isHideMenu" @click="isHideMenu = false"><DArrowRight /></el-icon>
        <el-icon v-else @click="isHideMenu = true"><DArrowLeft /></el-icon>
        <el-icon @click="startMakePlan"><Operation /></el-icon>
        <el-icon @click="startMakePlan"><Calendar /></el-icon>
      </div>
      <div class="header-right">
        <div v-if="curSelfControlPlan" class="text">{{ curSelfControlPlan.startTime }}</div>
      </div>
    </div>
    <div v-if="curSelfControlPlan && curSelfControlPlan.list.length" class="card-content">
      <div v-for="(item, index) in curSelfControlPlan.list" :key="index" class="plan-item">
        <div class="label" :class="{ hide: isHideMenu }">{{ item.label }}</div>
        <div v-for="(checkItem, index) in item.checkList" :key="index" class="check-box-item" :class="{ 'is-today': checkIsToday(index) }">
          <el-checkbox v-model="checkItem.value" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { StorageKey, getStorage, setStorage } from '@/common/utils/storage'
import { Calendar, Operation, ReadingLamp, Fold, Expand, DArrowLeft, DArrowRight, Pouring } from '@element-plus/icons-vue'
import moment from 'moment'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const startMakePlan = () => {
  router.push({
    name: 'selfControl'
  })
}
const curSelfControlPlan = ref()
const allSelfControlPlan = ref()
watch(
  () => curSelfControlPlan.value,
  val => {
    const targetIndex = allSelfControlPlan.value.findIndex((item: any) => item.name == val.name)
    if (targetIndex >= 0) {
      allSelfControlPlan.value.splice(targetIndex, 1, val)
      setStorage(StorageKey.SelfControlPlanList, JSON.stringify(allSelfControlPlan.value))
    }
    setStorage(StorageKey.CurSelfControlPlan, JSON.stringify(val))
  },
  {
    deep: true
  }
)
const isHideMenu = ref(false)
onMounted(async () => {
  const localSelfControlListStr = await getStorage(StorageKey.SelfControlPlanList)
  if (localSelfControlListStr) {
    allSelfControlPlan.value = JSON.parse(localSelfControlListStr) || []
  }
  if (allSelfControlPlan.value.length <= 0) {
    await setStorage(StorageKey.CurSelfControlPlan, '')
  }

  const localSelfControlStr = await getStorage(StorageKey.CurSelfControlPlan)
  if (localSelfControlStr) {
    curSelfControlPlan.value = JSON.parse(localSelfControlStr) || {}
  }
})

const checkIsToday = (index: number) => {
  const { startTime, days } = curSelfControlPlan.value
  const diffDay = moment().diff(moment(startTime), 'day')
  return Number(diffDay) == Number(index)
}
</script>
<style lang="scss" scoped>
.self-control-card-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    width: 100%;
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.54);
    .header-left {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
    }
    .el-icon {
      margin-right: 10px;
      cursor: pointer;
    }
    .header-right {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .card-content {
    flex-grow: 1;
    overflow: auto;
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
        &.hide {
          width: 0;
        }
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
      }
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }
}
</style>
