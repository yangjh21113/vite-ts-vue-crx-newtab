<template>
  <div class="home-container" :class="[curMode]" :style="{ backgroundImage: `url(${curBgImg})` }">
    <div class="header">
      <div class="slogan">
        <div class="slogan-text" :style="{ color: sloganPreviewColor || curSloganColor, backgroundColor: sloganPreviewBgColor || curSloganBgColor }" :title="curSlogan">{{ curSlogan }}</div>
        <el-popover ref="sloganEditPopperEle" popper-class="common-popper" effect="dark" placement="bottom" trigger="click" @show="showEditSloganPopper = true" @hide="showEditSloganPopper = false">
          <div class="edit-slogan-popper">
            <div class="edit-menu-item" @click.stop="sloganEditColor">修改文字颜色</div>
            <div class="edit-menu-item" @click.stop="sloganEditBgColor">修改背景色</div>
          </div>
          <template #reference>
            <el-icon v-show="!isSloganColorEditing && !isSloganBgEditing" class="edit-slogan-btn" :class="{ 'is-show': showEditSloganPopper }"><Edit /></el-icon>
          </template>
        </el-popover>
        <div v-show="isSloganColorEditing || isSloganBgEditing" class="color-picker">
          <el-color-picker v-if="isSloganColorEditing" v-model="curSloganColor" show-alpha :predefine="predefineColors" @hide="isSloganColorEditing = false" @active-change="colorActiveChange" @change="colorChange" />
          <el-color-picker v-if="isSloganBgEditing" v-model="curSloganBgColor" show-alpha :predefine="predefineColors" @hide="isSloganBgEditing = false" @active-change="bgColorActiveChange" @change="colorChange" />
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div v-if="curMode === ModeType.Focus" class="content-inner">
        <!-- <div class="time-box">{{ curTime }}</div> -->
      </div>
      <div v-if="curMode === ModeType.Normal" class="normal-content">
        <div class="card-item daily-task-box">
          <div class="card-header">
            <div class="left-text">
              <div class="title">每日任务</div>
              <div class="subtitle">{{ curDate }}</div>
            </div>
            <div class="right-btns">
              <el-icon v-if="showTaskAddInput" class="add-btn" @click="startAddTask(false)"><CircleCloseFilled /></el-icon>
              <el-icon v-else class="add-btn" @click="startAddTask(true)">
                <CirclePlusFilled />
              </el-icon>
              <el-icon class="more-btn"><ArrowRight /></el-icon>
            </div>
          </div>
          <div v-if="showTaskAddInput" class="add-task-box">
            <input v-model="taskInputContent" placeholder="在这里输入新的任务" class="add-task-input" @keydown.enter="addTask" />
            <el-icon class="add-btn" @click="addTask"><Select /></el-icon>
          </div>
          <div class="task-list">
            <div v-for="(item, index) in dailyTaskList" :key="item.id" class="list-item">
              <el-checkbox v-model="item.checked" class="check-icon" size="small" @change="taskCheckChange" />
              <div class="item-label" :class="{ checked: item.checked }">{{ item.label }}</div>
              <el-dropdown trigger="click" placement="bottom-end">
                <el-icon class="more-btn"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="deleteDailyTaskItem(index)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="card-item month-target-box">
          <div class="card-header">本月目标</div>
          <div>减肥10斤</div>
          <div>写博客</div>
        </div>
        <CountDownCard class="card-item progress-card-box" />

        <div class="card-item tech-study-box">
          <div class="card-header" @click="editTechStudyPlan">技术学习</div>
          <div class="list-content">
            <div v-for="item in techStudyList" :key="item.id" class="list-item" @click="toTargetTechStudyPage(item.name)">
              <span class="item-label">{{ item.label }}</span>
              <el-icon class="detail-btn"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        <SelfControlCard class="card-item self-control-box" />
        <div class="card-item mood-card-box">
          <div class="emoji-icon">{{ curMoodEmoji }}</div>
          <el-icon ref="emojiEditBtnEle" class="edit-btn" @click="editEmojiIcon"><Edit /></el-icon>
          <EmojiPicker v-show="showEmojiPicker" ref="emojiPickerEle" class="emoji-picker" @select="onSelectEmoji" />
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-popover popper-class="common-popper" effect="dark" placement="bottom" :width="500" trigger="click" v-model="showPopper">
        <div class="setting-container">
          <div class="setting-menu-list">
            <div class="list-item" :class="{ active: curTab === TabType.Mode }" @click="changeTab(TabType.Mode)">切换模式</div>
            <div class="list-item" :class="{ active: curTab === TabType.BgImg }" @click="changeTab(TabType.BgImg)">更换背景图片</div>
            <div class="list-item" :class="{ active: curTab === TabType.Slogan }" @click="changeTab(TabType.Slogan)">修改标语</div>
          </div>
          <div class="setting-content">
            <div v-if="curTab === TabType.Mode" class="setting-tab">
              <el-radio-group v-model="curMode" size="large" @change="onModeChange">
                <el-radio :label="ModeType.Focus">沉浸模式</el-radio>
                <el-radio :label="ModeType.Normal">正常模式</el-radio>
                <el-radio :label="ModeType.Summary">总结模式</el-radio>
              </el-radio-group>
            </div>
            <div v-if="curTab === TabType.BgImg" class="setting-tab bg-img">
              <div class="header">
                <div class="title">背景图片</div>
                <div class="subtitle">每天都有好心情</div>
              </div>
              <div class="default-img-outer">
                <div class="default-img-list">
                  <div v-for="(item, index) in bgImgList" :key="index" :src="item" :style="{ backgroundImage: `url(${item})` }" class="img-item-box" @click="selectBgImg(item)">
                    <div v-show="item === curBgImg" class="btn-groups">
                      <el-icon><SuccessFilled /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="curTab === TabType.Slogan" class="setting-tab slogan">
              <div class="header">
                <div class="title">标语</div>
                <div class="subtitle">没事喝点心灵鸡汤</div>
              </div>
              <div class="add-box">
                <input v-model="addSloganContent" placeholder="在这里输入新的内容" class="input-box" @keydown.enter="addSlogon" />
                <el-icon class="add-btn" @click="addSlogon"><CirclePlusFilled /></el-icon>
              </div>
              <div class="default-slogan-list">
                <div v-for="(item, index) in sloganList" :key="index" class="slogan-item">
                  <el-icon v-if="item === curSlogan" class="seleted-flag"><Flag /></el-icon>
                  <div class="text">{{ item }}</div>
                  <div class="btn-groups">
                    <el-icon @click="selectSlogan(item)"><Select /></el-icon>
                    <el-icon @click="deleteSlogan(index)"><Delete /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #reference>
          <el-icon class="setting-btn">
            <Setting />
          </el-icon>
        </template>
      </el-popover>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Setting, MoreFilled, Edit, Switch, ArrowRight, SuccessFilled, Flag, Delete, Select, CirclePlusFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import moment, { duration } from 'moment'
import { StorageKey, getStorage, setStorage } from '@/common/utils/storage'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import SelfControlCard from '../components/SelfControlCard.vue'
import CountDownCard from '@/offscreen/newtab/components/CountDownCard.vue'
import BgImg1 from '@/common/assets/images/bg-img-1.jpg'
import BgImg2 from '@/common/assets/images/bg-img-2.jpg'
import BgImg3 from '@/common/assets/images/bg-img-3.jpg'
import BgImg4 from '@/common/assets/images/bg-img-4.jpg'
import BgImg5 from '@/common/assets/images/bg-img-5.jpg'
import BgImg6 from '@/common/assets/images/bg-img-6.jpg'
import BgImg7 from '@/common/assets/images/bg-img-7.jpg'
import BgImg8 from '@/common/assets/images/bg-img-8.jpg'
const sloganList = ref([
  '女性如果精神贫瘠，执着于被爱，过于渴望被认可，那无论她享有各种能力和资源，都很难救她于现实的困境',
  '你在寻找的奇迹就隐藏在你一直逃避的行动里',
  '任何没通过的考试都是不够努力',
  '想只有困难，做才有答案',
  '除了真实的病痛，其他的痛苦都是我们自己臆想制造出来的,认知不足造成的情绪和心理上的痛苦',
  '调节高度理想化的自己和这个没法改变的现实的世界',
  '总是要成为你坐在的那个乐队的最差的乐手，如果你是乐队中最好的乐手，就需要重新选择乐队了，我认为这也适用于乐队之外的其他事情',
  '所以人类的痛苦其实就是和自己的欲望做斗争'
])
const taskInputContent = ref('')
const showTaskAddInput = ref(false)
const startAddTask = (flag: boolean) => {
  showTaskAddInput.value = flag
  taskInputContent.value = ''
}
const taskCheckChange = () => {
  setStorage(StorageKey.TaskList, JSON.stringify(dailyTaskList.value))
}
const addTask = () => {
  if (!taskInputContent.value) {
    return
  }
  dailyTaskList.value.unshift({
    id: dailyTaskList.value.length + 1,
    label: taskInputContent.value,
    checked: false
  })
  taskInputContent.value = ''
  setStorage(StorageKey.TaskList, JSON.stringify(dailyTaskList.value))
}

const dailyTaskList = ref([
  {
    id: 1,
    label: '查看联想邮件',
    checked: false
  },
  {
    id: 2,
    label: '查看联合利泰邮件',
    checked: false
  }
])
const deleteDailyTaskItem = (index: number) => {
  dailyTaskList.value.splice(index, 1)
  setStorage(StorageKey.TaskList, JSON.stringify(dailyTaskList.value))
}
const bgImgList = ref([BgImg1, BgImg2, BgImg3, BgImg4, BgImg5, BgImg6, BgImg7, BgImg8])
const showPopper = ref(true)
enum ModeType {
  Focus = 'focus',
  Normal = 'normal',
  Summary = 'summary'
}
enum TabType {
  Mode = 'mode',
  Slogan = 'slogan',
  BgImg = 'bg_img'
}
const techStudyList = ref()
const editTechStudyPlan = () => {
  router.push({
    name: 'techStudy'
  })
}
const toTargetTechStudyPage = (name: string) => {
  router.push({
    name: name
  })
}
const curSloganColor = ref('#fff')
const curSloganBgColor = ref('')
const sloganPreviewColor = ref('')
const sloganPreviewBgColor = ref('')
const predefineColors = ref(['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577'])
const curTime = ref()
const curDate = ref(moment().format('YY-MM-DD'))
const curMode = ref(ModeType.Focus)
const showEditSloganPopper = ref(false)
const sloganEditPopperEle = ref()
const isSloganColorEditing = ref(false)
const isSloganBgEditing = ref(false)
const sloganEditColor = () => {
  isSloganColorEditing.value = true
  isSloganBgEditing.value = false
  if (sloganEditPopperEle.value) {
    sloganEditPopperEle.value.hide()
  }
}
const sloganEditBgColor = () => {
  isSloganBgEditing.value = true
  isSloganColorEditing.value = false
  if (sloganEditPopperEle.value) {
    sloganEditPopperEle.value.hide()
  }
}

const curSlogan = ref('你在寻找的奇迹就隐藏在你一直逃避的行动里')
const router = useRouter()
const curTab = ref(TabType.Mode)
const addSloganContent = ref('')
const curBgImg = ref(BgImg1)
const emojiPickerEle = ref(null)
const emojiEditBtnEle = ref(null)
const changeTab = (tab: TabType) => {
  curTab.value = tab
}
const colorChange = () => {
  isSloganColorEditing.value = false
  isSloganBgEditing.value = false
}
const colorActiveChange = (color: string) => {
  sloganPreviewColor.value = color
  sloganPreviewBgColor.value = ''
  setStorage(StorageKey.CurSloganColor, color)
}
const bgColorActiveChange = (color: string) => {
  sloganPreviewBgColor.value = color
  sloganPreviewColor.value = ''
  setStorage(StorageKey.CurSloganBgColor, color)
}
const showEmojiPicker = ref(false)
const curMoodEmoji = ref('😚')
const onSelectEmoji = (emoji: any) => {
  curMoodEmoji.value = emoji.i
  setStorage(StorageKey.CurMoodEmoji, emoji.i)
  showEmojiPicker.value = false
}
const editEmojiIcon = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}
const selectBgImg = (item: any) => {
  curBgImg.value = item
  setStorage(StorageKey.CuBgImg, item)
}

const addSlogon = () => {
  if (!addSloganContent.value) {
    return
  }
  sloganList.value.unshift(addSloganContent.value)
}
const deleteSlogan = (index: number) => {
  sloganList.value.splice(index, 1)
}
const selectSlogan = (item: string) => {
  curSlogan.value = item
  setStorage(StorageKey.CurSlogan, item)
}
watch(
  () => sloganList.value,
  () => {
    setStorage(StorageKey.SloganList, JSON.stringify(sloganList.value))
  },
  {
    deep: true
  }
)
const updateTime = () => {
  curTime.value = moment().format('mm:ss')
  setTimeout(() => {
    updateTime()
  }, 1000)
}
updateTime()
const onModeChange = (v: string) => {
  setStorage(StorageKey.Mode, v)
}
onBeforeMount(async () => {
  // setStorage(StorageKey.TechStudyList, JSON.stringify(techStudyList.value))

  const localTechStudyListStr = await getStorage(StorageKey.TechStudyList)
  if (localTechStudyListStr) {
    techStudyList.value = JSON.parse(localTechStudyListStr)
  }
  curMode.value = ((await getStorage(StorageKey.Mode)) as ModeType) || curMode.value
  const localSloganListStr = await getStorage(StorageKey.SloganList)
  if (localSloganListStr) {
    sloganList.value = JSON.parse(localSloganListStr)
  }
  curSlogan.value = (await getStorage(StorageKey.CurSlogan)) || curSlogan.value
  curBgImg.value = (await getStorage(StorageKey.CuBgImg)) || curBgImg.value
  curMoodEmoji.value = (await getStorage(StorageKey.CurMoodEmoji)) || curMoodEmoji.value
  curSloganColor.value = (await getStorage(StorageKey.CurSloganColor)) || curSloganColor.value
  curSloganBgColor.value = (await getStorage(StorageKey.CurSloganBgColor)) || curSloganBgColor.value
  const localTaskListStr = await getStorage(StorageKey.TaskList)
  if (localTaskListStr) {
    dailyTaskList.value = JSON.parse(localTaskListStr)
  }
})
const onDocClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target) {
    return
  }
  if (!emojiPickerEle.value || !emojiEditBtnEle.value) {
    return
  }
  const emojiPickerEleRealEle = (emojiPickerEle.value as any).$el as HTMLElement
  const emijEditBtnEleRealEle = (emojiEditBtnEle.value as any).$el as HTMLElement
  if (!emojiPickerEleRealEle.contains(target) && !emijEditBtnEleRealEle.contains(target)) {
    showEmojiPicker.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  &.focus {
    .header {
      opacity: 0;
      visibility: hidden;
    }
    .bottom {
      .setting-btn {
        opacity: 0;
        visibility: hidden;
      }
      &:hover {
        .setting-btn {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 24px;
    text-align: center;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    .slogan {
      max-width: 800px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 4px;
      overflow: hidden;
      font-size: 18px;
      color: #fff;
      .slogan-text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px 10px;
        border-radius: 4px;
      }
      .edit-slogan-btn {
        margin-left: 4px;
        width: 28px;
        height: 28px;
        opacity: 0;
        visibility: hidden;
        cursor: pointer;
        &.is-show {
          opacity: 1;
          visibility: visible;
        }
      }
      &:hover {
        .edit-slogan-btn {
          opacity: 1;
          visibility: visible;
        }
      }
      .color-picker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        // opacity: 0;
        // visibility: hidden;
        // &.is-show {
        //   opacity: 1;
        //   visibility: visible;
        // }
        :deep(.el-color-picker__trigger) {
          width: 28px;
          height: 28px;
          border: none;
          .el-color-picker__color.is-alpha {
            border-radius: 4px;
            overflow: hidden;
            // border: none;
          }
        }
      }
      &:hover {
        .color-picker {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
  .content-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    padding: 24px;
    .content-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .time-box {
        font-size: 120px;
        color: #fff;
      }
    }
    .normal-content {
      max-width: 1200px;
      max-height: 800px;
      display: grid;
      align-items: stretch;
      justify-content: center;
      grid-auto-flow: row dense;
      grid-template-columns: 200px 200px 200px 200px;
      grid-template-rows: 120px 120px 200px;
      grid-template-areas:
        'a a b b'
        'a a c c'
        'd e e f';
      gap: 15px;
      .card-item {
        display: inline-flex;
        flex-direction: column;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.87);
        border-radius: 4px;
        .card-header {
          font-size: 16px;
          font-weight: 600;
          line-height: 32px;
        }
      }
      .daily-task-box {
        // 两种实现方式
        // grid-column: 1/3;
        // grid-row: 1/3;
        grid-area: a;
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        overflow: hidden;
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          .left-text {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-grow: 1;
            .title {
              font-size: 16px;
            }
            .subtitle {
              margin-left: 4px;
              font-size: 12px;
              font-weight: normal;
              color: rgba(0, 0, 0, 0.54);
            }
          }
          .right-btns {
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.54);
            opacity: 0;
            visibility: hidden;
            .el-icon + .el-icon {
              margin-left: 5px;
            }
            .el-icon {
              cursor: pointer;
            }
          }
          &:hover {
            .right-btns {
              opacity: 1;
              visibility: visible;
            }
          }
        }
        .add-task-box {
          margin: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          .add-task-input {
            padding: 0 8px;
            border: none;
            background: transparent;
            flex-grow: 1;
            font-size: 12px;
            line-height: 28px;
            outline: none;
            color: rgba(0, 0, 0, 0.87);
          }
          .add-btn {
            margin: 0 4px;
            font-size: 14px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.54);
          }
        }
        .task-list {
          overflow: auto;
          flex-grow: 1;
          .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            font-size: 14px;
            line-height: 28px;
            .check-icon {
              margin-right: 8px;
            }
            .item-label {
              flex-grow: 1;
              &.checked {
                text-decoration: line-through;
                color: rgba(0, 0, 0, 0.54);
              }
            }
            .more-btn {
              cursor: pointer;
              color: rgba(0, 0, 0, 0.54);
              opacity: 0;
              visibility: hidden;
            }

            &:hover {
              background: rgba(0, 0, 0, 0.04);
              .more-btn {
                opacity: 1;
                visibility: visible;
              }
            }
          }
        }
      }
      .month-target-box {
        grid-column: span 2;
      }
      .progress-card-box {
        grid-column: 3/5;
        padding: 10px;
      }
      .self-control-box {
        grid-column: 2/4;
        padding: 0 0 10px 0;
      }
      .tech-study-box {
        padding: 10px 0;
        overflow: hidden;
        .card-header {
          padding: 0 10px;
          cursor: pointer;
        }
        .list-content {
          overflow: auto;
          .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            font-size: 14px;
            line-height: 28px;
            cursor: pointer;
            .item-label {
              flex-grow: 1;
            }
            .detail-btn {
              width: 16px;
              color: rgba(0, 0, 0, 0.54);
              opacity: 0;
            }
            &:hover {
              background: rgba(0, 0, 0, 0.04);
              .detail-btn {
                opacity: 1;
              }
            }
          }
        }
      }
      .mood-card-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .emoji-icon {
          font-size: 120px;
        }
        .edit-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 24px;
          height: 24px;
          color: rgba(0, 0, 0, 0.54);
          font-size: 18px;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          &:hover {
            background: rgba(0, 0, 0, 0.12);
          }
        }
        &:hover {
          .edit-btn {
            opacity: 1;
            visibility: visible;
          }
        }
        .emoji-picker {
          position: absolute;
          left: 100%;
          top: 0;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 24px;
    color: #fff;
    .setting-btn {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }
  }
}

.edit-slogan-popper {
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  .edit-menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 10px;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
}
.setting-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  // border: 10px solid blue;
  height: 500px;
  .setting-menu-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border-right: 1px solid rgba(255, 255, 255, 0.18);
    padding: 10px 0;
    font-size: 14px;
    .list-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 4px 12px;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.42);
      cursor: pointer;
      &:hover,
      &.active {
        color: #fff;
        // background: rgba(255, 255, 255, 0.18);
      }
    }
  }
  .setting-content {
    flex-grow: 1;
    padding: 10px 12px;
    width: 500px;
    overflow: hidden;
    .setting-tab {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .header {
        display: inline-flex;
        align-items: flex-end;
        flex-shrink: 0;
        .title {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        .subtitle {
          margin-left: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.42);
        }
      }
      &.bg-img {
        .default-img-outer {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
          flex-grow: 1;
          overflow: auto;
          .default-img-list {
            display: grid;
            grid-template-columns: repeat(4, 20%);
            gap: 20px;
            .img-item-box {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 80px;
              height: 80px;
              border: 1px solid rgba(255, 255, 255, 0.32);
              border-radius: 4px;
              position: relative;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              cursor: pointer;
              .btn-groups {
                position: absolute;
                right: 4px;
                top: 4px;
                background: rgba(0, 0, 0, 0.52);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 2px 4px;
                border-radius: 4px;
                font-size: 12px;
                cursor: default;
              }
            }
          }
        }
      }
      &.slogan {
        .add-box {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          .input-box {
            padding: 0 10px;
            flex-grow: 1;
            font-size: 14px;
            line-height: 32px;
            background: transparent;
            outline: none;
            border: none;
            color: #fff;
          }
          .add-btn {
            margin-right: 4px;
            flex-shrink: 0;
            font-size: 16px;
            color: #fff;
            cursor: pointer;
          }
        }
        .default-slogan-list {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.72);
          flex-grow: 1;
          overflow-y: auto;
          .slogan-item {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            line-height: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            position: relative;
            .seleted-flag {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              color: red;
            }
            .btn-groups {
              margin: 4px 4px 4px 10px;
              flex-shrink: 0;
              font-size: 14px;
              display: inline-flex;
              align-items: center;
              justify-content: flex-start;
              opacity: 0;
              visibility: hidden;
              .el-icon {
                cursor: pointer;
              }
              .el-icon + .el-icon {
                margin-left: 10px;
              }
            }
            &:hover {
              .seleted-flag {
                display: none;
              }
              .btn-groups {
                opacity: 1;
                visibility: visible;
              }
            }
          }
        }
      }
    }
  }
}
</style>
