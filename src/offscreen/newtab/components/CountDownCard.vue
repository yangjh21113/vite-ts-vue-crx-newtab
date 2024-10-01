<template>
  <div class="progress-box">
    <div v-if="!curCountDown" class="welcome-box" @click="addCountDown">新增倒计时</div>
    <div v-if="curCountDown" class="progress-content">
      <div class="progress-des">
        <div class="desc-list-item">
          <div class="label">{{ handleText('开始时间') }}</div>
          <div class="value">{{ handleText(curCountDown.startTime) }}</div>
        </div>
        <div class="desc-list-item">
          <div class="label">{{ handleText(`已经过去(${getLabelByUnit(curCountDown.durationUnit)})`) }}</div>
          <div class="value">{{ handleText(getAlreadyTime(curCountDown)) }}</div>
        </div>
        <div class="desc-list-item">
          <div class="label">{{ handleText('结束时间') }}</div>
          <div class="value">{{ handleText(getEndTime(curCountDown)) }}</div>
        </div>
      </div>
      <el-progress class="progress-item" type="circle" :percentage="curCountDown.percentage" width="100" :format="() => getProgressFormat(curCountDown)" />
    </div>
    <div v-if="curCountDown" class="btn-groups">
      <el-icon class="hide-btn" @click="hideContent"><Hide /></el-icon>
      <el-icon class="switch-btn" @click="addCountDown"><Switch /></el-icon>
    </div>

    <el-dialog v-model="dialogVisible" title="倒计时管理" width="500px" class="common-dialog count-down-manage-dialog">
      <div class="dialog-content">
        <div class="add-box">
          <div class="add-item">
            <div class="label">名称</div>
            <input v-model="addInfo.name" class="value" placeholder="输入倒计时名称" />
          </div>
          <div class="add-item">
            <div class="label">开始时间</div>
            <el-date-picker v-model="addInfo.startTime" class="value" type="date" placeholder="选择开始时间" />
          </div>
          <div class="add-item">
            <div class="label">持续时间</div>
            <input v-model="addInfo.duration" class="value" placeholder="输入持续时长" />
            <el-select v-model="addInfo.durationUnit" clearable placeholder="Select" style="width: 240px">
              <el-option v-for="item in durationUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-button class="add-btn" type="primary" @click="addItem">确定添加</el-button>
        </div>
        <div v-if="countDownList.length" class="list-content">
          <div v-for="(item, index) in countDownList" :key="item.id" class="list-item" :class="{ checked: curCountDown && item.name === curCountDown.name, active: addInfo && addInfo.name === item.name }" @click="selectItem(item)">
            <div class="item-inner">
              <div class="label">{{ item.name }}</div>
              <div class="label">{{ moment(item.startTime).format('YYYY-MM-DD') }}</div>
              <div class="label">{{ item.duration }}</div>
              <div class="label">{{ getLabelByUnit(item.durationUnit) }}</div>
            </div>
            <el-icon class="edit-icon" @click="editItem(item)"><Edit /></el-icon>
            <el-icon class="delete-icon" @click="deleteItem(index)"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { StorageKey, getStorage, setStorage } from '@/common/utils/storage'
import { Switch, Hide, Delete, Edit } from '@element-plus/icons-vue'
import moment from 'moment'
import { onMounted, ref } from 'vue'
const dialogVisible = ref(false)
const countDownList: any = ref([])
const durationUnitOptions = ref([
  {
    label: '天',
    value: 'day'
  },
  {
    label: '月',
    value: 'month'
  },
  {
    label: '年',
    value: 'year'
  },
  {
    label: '分',
    value: 'minute'
  },
  {
    label: '时',
    value: 'hour'
  }
])
const addInfo = ref({
  name: '',
  startTime: '',
  durationUnit: 'day',
  duration: ''
})
const curCountDown: any = ref()
const isContentHide = ref(false)
const getLabelByUnit = (unit: string) => {
  return durationUnitOptions.value.find(item => item.value === unit)?.label
}
const getProgressFormat = (item: any) => {
  const { name, duration } = item
  const alreadyTime = getAlreadyTime(item)
  let percentage = 0
  if (Number(alreadyTime) > Number(duration)) {
    percentage = 100
  } else {
    percentage = Number(((Number(alreadyTime) / Number(duration)) * 100).toFixed(0))
  }
  curCountDown.value.percentage = percentage
  if (isContentHide.value) {
    return `${percentage}%`
  }
  return `${name} ${percentage}%`
}
const hideContent = () => {
  isContentHide.value = !isContentHide.value
}
const handleText = (text: string) => {
  if (isContentHide.value) {
    return '**'
  }
  return text
}
const addCountDown = () => {
  dialogVisible.value = true
  addInfo.value = {
    name: '',
    startTime: '',
    durationUnit: 'day',
    duration: ''
  }
}
const getAlreadyTime = (item: any) => {
  const { startTime, durationUnit } = item
  const diffDay = moment().diff(moment(startTime), durationUnit)
  return `${diffDay}`
}
const getEndTime = (item: any) => {
  const { startTime, duration, durationUnit } = item
  const endTime = moment(startTime).add(duration, durationUnit)
  return `${moment(endTime).format('YYYY-MM-DD')}`
}
const addItem = () => {
  const hasItemIndex = countDownList.value.findIndex(item => item.name == addInfo.value.name)
  if (hasItemIndex >= 0) {
    countDownList.value.splice(hasItemIndex, 1)
  }
  const addInfoItem = {
    ...addInfo.value,
    startTime: moment(addInfo.value.startTime).format('YYYY-MM-DD')
  }
  countDownList.value.unshift(addInfoItem)
  setStorage(StorageKey.CountDownList, JSON.stringify(countDownList.value))
}
const selectItem = (item: any) => {
  curCountDown.value = item
  setStorage(StorageKey.CurCountDown, JSON.stringify(item))
}
const editItem = (item: any) => {
  addInfo.value = item
}
const deleteItem = (index: number) => {
  countDownList.value.splice(index, 1)
  setStorage(StorageKey.CountDownList, JSON.stringify(countDownList.value))
}
onMounted(async () => {
  const localCountDownListStr = await getStorage(StorageKey.CountDownList)
  if (localCountDownListStr) {
    countDownList.value = JSON.parse(localCountDownListStr) || []
  }
  if (countDownList.value.length <= 0) {
    await setStorage(StorageKey.CurCountDown, '')
  }
  const localCurCountDownStr = await getStorage(StorageKey.CurCountDown)
  if (localCurCountDownStr) {
    curCountDown.value = JSON.parse(localCurCountDownStr) || {}
  }
})
</script>
<style lang="scss" scoped>
.progress-box {
  padding: 10px;
  position: relative;
  overflow: hidden;
  position: relative;
  .welcome-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.24);
    border: 1px dashed;
    border-radius: 4px;
    cursor: pointer;
  }
  .progress-content {
    display: flex;
    align-items: stretch;
    justify-content: center;
    height: 100%;
    .progress-des {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(3, 32px);
      gap: 0 20px;
      flex-grow: 1;
      font-size: 14px;
      line-height: 32px;
      overflow: auto;
      .desc-list-item {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        .label {
          color: rgba(0, 0, 0, 0.54);
        }
      }
    }
    .progress-item {
      margin-left: 40px;
      flex-shrink: 0;
    }
  }
  .btn-groups {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    padding: 4px 10px;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    position: absolute;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    bottom: 0;
    right: 0;
    z-index: 1;
    transform: translateY(100%);
    transition: transform 0.5s linear;
    .switch-btn,
    .hide-btn {
      margin-left: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.54);
      cursor: pointer;
    }
  }
  &:hover {
    .btn-groups {
      transform: translateY(0);
    }
  }
}
.count-down-manage-dialog {
  .dialog-content {
    display: flex;
    flex-direction: column;
    padding: 10px 24px 24px;
    max-height: 400px;
    .add-box {
      display: flex;
      flex-direction: column;
      .add-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .label {
          width: 80px;
          color: rgba(0, 0, 0, 0.54);
          font-size: 14px;
          line-height: 32px;
          flex-shrink: 0;
        }
        :deep(.value) {
          display: inline-block;
          width: 100%;
          padding: 0 10px;
          font-size: 14px;
          line-height: 32px;
          flex-grow: 1;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          &::placeholder {
            color: rgba(0, 0, 0, 0.32);
          }
          .el-input__wrapper {
            width: 100%;
          }
          &.el-input {
            border: none;
            padding: 0;
          }
        }
      }
      .add-btn {
        //
      }
    }
    .list-content {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      overflow: auto;
      .list-item + .list-item {
        margin-top: 10px;
      }
      .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        cursor: pointer;
        .item-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          font-size: 14px;
          line-height: 32px;
        }
        .delete-icon,
        .edit-icon {
          margin-left: 10px;
          flex-shrink: 0;
          cursor: pointer;
        }
        &.checked {
          border-color: blue;
        }
        &.active {
          color: red;
        }
      }
    }
  }
}
</style>
