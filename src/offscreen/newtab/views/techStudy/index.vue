<template>
  <div class="tech-study-page">
    <div class="welcome-container" :class="{ hide: !showWelcome }">
      <css-doodle>background: @shaders( void main() { vec2 p = gl_FragCoord.xy / u_resolution.xy; FragColor = vec4(p.yx, .8, 1.); } );</css-doodle>
      <div v-if="countDownNum == 3" class="count-down-box">
        <div class="count-down-inner">{{ countDownNum }}</div>
      </div>
      <div v-if="countDownNum == 2" class="count-down-box">
        <div class="count-down-inner">{{ countDownNum }}</div>
      </div>
      <div v-if="countDownNum == 1" class="count-down-box">
        <div class="count-down-inner">{{ countDownNum }}</div>
      </div>
      <div class="welcome-title">大厂入场券</div>
      <div class="welcome-desc">{{ curSlogan }}</div>
    </div>

    <div class="header">
      <el-icon class="back-btn" @click="toHomePage"><ArrowLeft /></el-icon>
      <div class="header-inner">
        <div class="title" @click="toTechStudyHome">个人提升路径</div>
      </div>
      <el-icon class="edit-btn" @click="onDialogOpen">
        <Tools />
      </el-icon>
    </div>
    <div class="page-content">
      <draggable v-model="techStudyList" class="home-menu" :class="{ 'is-side-bar': isMenuMode }">
        <template #item="{ element }">
          <div class="card-item" @click="toDetail(element.name)">
            <div>{{ element.label }}</div>
          </div>
        </template>
      </draggable>
      <div v-if="isMenuMode" class="home-content">
        <RouterView />
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="任务管理" width="500px" class="edit-task-dialog">
      <div class="edit-dialog-content">
        <div class="add-box">
          <input v-model="addTaskContent" placeholder="在这里输入新的内容" class="input-box" @keydown.enter="addTask" />
          <el-icon class="add-btn" @click="addTask"><CirclePlusFilled /></el-icon>
        </div>
        <div v-for="(item, index) in techStudyEditList" :key="item.id" class="task-item">
          <div class="task-item-inner">
            <input v-model="item.label" class="task-input" />
            <el-rate v-model="item.rate" size="small" class="task-rate" />
            <el-icon class="delete-icon" @click="deleteTask(index)"><Delete /></el-icon>
          </div>
          <el-slider v-model="item.progress" size="small" class="task-slider" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveTechList">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import 'animate.css'
import 'css-doodle'
import { Tools, Delete, CirclePlusFilled, ArrowLeft } from '@element-plus/icons-vue'
import { StorageKey, getStorage, setStorage } from '@/common/utils/storage'
import { cloneDeep } from 'lodash'
const router = useRouter()
const route = useRoute()
const toDetail = (name: string) => {
  console.log('name', `${route.path}/${name}`)
  router.push({
    name: `${name}`
  })
}

const dialogVisible = ref(false)
const techStudyList = ref([
  {
    id: 3,
    label: '动画',
    name: 'techAnimateDetail',
    rate: 0,
    progress: 10
  },
  {
    id: 4,
    label: '拖拽',
    name: 'techDragDetail',
    rate: 0,
    progress: 10
  },
  {
    id: 1,
    label: '性能监控 sentry',
    rate: 0,
    progress: 10
  },
  {
    id: 2,
    label: '性能优化打包',
    rate: 0,
    progress: 10
  },
  {
    id: 5,
    label: 'uniapp 项目',
    rate: 0,
    progress: 10
  },
  {
    id: 6,
    label: '架构设计',
    rate: 0,
    progress: 10
  },
  {
    id: 7,
    label: '利用AI',
    rate: 0,
    progress: 10
  }
])
const isMenuMode = computed(() => {
  return route.name !== 'techStudy'
})
const techStudyEditList = ref()
const addTaskContent = ref('')
const addTask = () => {
  if (!addTaskContent.value) {
    return
  }
  techStudyEditList.value.unshift({
    id: techStudyEditList.value.length,
    label: addTaskContent.value,
    rate: 0,
    progress: 0
  })
  addTaskContent.value = ''
}
const deleteTask = (index: number) => {
  techStudyEditList.value.splice(index, 1)
}
const toHomePage = () => {
  router.push({
    name: 'home'
  })
}
const toTechStudyHome = () => {
  router.push({
    name: 'techStudy'
  })
}
const onDialogOpen = () => {
  dialogVisible.value = true
  techStudyEditList.value = cloneDeep(techStudyList.value)
}
const saveTechList = () => {
  dialogVisible.value = false
  techStudyList.value = techStudyEditList.value
  techStudyEditList.value = []
  setStorage(StorageKey.TechStudyList, JSON.stringify(techStudyList.value))
}
const curSlogan = ref('你在寻找的奇迹就隐藏在你一直逃避的行动里')
const countDownNum = ref(3)
const showWelcome = ref(true)
const coundDownFn = () => {
  setTimeout(() => {
    countDownNum.value--
    if (countDownNum.value > 0) {
      coundDownFn()
    }
  }, 800)
}
onBeforeMount(() => {
  if (isMenuMode.value) {
    showWelcome.value = false
  }
})
onMounted(async () => {
  const localTechStudyListStr = await getStorage(StorageKey.TechStudyList)
  if (localTechStudyListStr) {
    techStudyList.value = JSON.parse(localTechStudyListStr)
  }
  setStorage(StorageKey.TechStudyList, JSON.stringify(techStudyList.value))

  curSlogan.value = (await getStorage(StorageKey.CurSlogan)) || curSlogan.value
  console.log(1111, curSlogan)
  coundDownFn()
  setTimeout(() => {
    showWelcome.value = false
  }, 3000)
})
onUnmounted(() => {})
</script>
<style lang="scss" scoped>
@keyframes row-loop {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

@keyframes narrow-hidden {
  0% {
    transform: scale(1);
  }

  100% {
    visibility: hidden;
    transform: scale(0.3);
  }
}

.tech-study-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .welcome-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    background: #fff;
    z-index: 2;
    overflow: hidden;
    color: #fff;
    opacity: 1;
    visibility: visible;
    transition: all 2s;

    &.hide {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      z-index: 0;
    }

    css-doodle {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .count-down-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 200px;
      top: calc(50% - 100px);
      left: calc(50% - 100px);
      border-radius: 50%;
      border: 4px solid transparent;
      font-size: 100px;
      background: #ffffffad;
      overflow: hidden;
      position: absolute;
      z-index: 10;
      animation: narrow-hidden 0.8s linear;
      animation-fill-mode: forwards;

      .count-down-inner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border: 4px solid #fff;
        backdrop-filter: blur(5px);
        border-radius: 50%;
        color: red;
      }
    }

    .welcome-title {
      font-size: 50px;
      font-weight: 600;
      display: inline-block;
      animation: bounceInDown;
      animation-duration: 0.5s;
      z-index: 3;
    }

    .welcome-desc {
      font-size: 20px;
      line-height: 30px;
      z-index: 3;
      font-weight: bold;
      animation: row-loop 10s linear infinite normal;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px;

    .back-btn {
      font-size: 18px;
      cursor: pointer;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 20px;
        line-height: 32px;
        font-weight: bold;
        cursor: pointer;
      }
    }

    .edit-btn {
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  .page-content {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;

    .home-menu {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 100px);
      align-items: stretch;
      gap: 20px;
      width: 100%;
      height: 100%;
      padding: 20px 0;
      max-width: 800px;
      overflow: auto;
      transition: width 0.5s;

      .card-item {
        border: 1px solid rgba(0, 0, 0, 0.12);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 100px;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s linear;

        &:hover {
          transform: scale(1.1);
        }
      }
      &.is-side-bar {
        display: flex;
        flex-direction: column;
        width: 200px;
        gap: 10px;

        .card-item {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          padding: 10px;
          gap: 4px;
          min-height: 32px;
          text-align: left;
          border-radius: 0;
          cursor: pointer;
          &:hover {
            transform: none;
          }
        }
      }
    }
    .home-content {
      flex-grow: 1;
    }
  }
}
</style>
<style lang="scss">
.edit-task-dialog {
  border-radius: 10px;

  .el-dialog__header {
    padding: 10px 24px;

    .el-dialog__title {
      font-size: 16px;
    }
  }

  .el-dialog__headerbtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    right: 10px;
    top: 10px;
  }

  .el-dialog__body {
    padding: 0;
  }

  .edit-dialog-content {
    display: flex;
    flex-direction: column;
    height: 300px;
    padding: 10px 24px;
    overflow: auto;
    .add-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      padding: 0px 10px;
      .input-box {
        flex-grow: 1;
        font-size: 14px;
        line-height: 34px;
      }
      .add-btn {
        flex-shrink: 0;
        cursor: pointer;
      }
    }

    .task-item + .task-item {
      margin-top: 10px;
    }

    .task-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .task-item-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        .task-input {
          padding: 0px 10px;
          flex-grow: 1;
          font-size: 14px;
          line-height: 32px;
        }
        .task-rate {
          flex-shrink: 0;
        }
        .delete-icon {
          display: inline-block;
          margin: 0 10px 0 4px;
          cursor: pointer;
        }
      }

      .task-slider {
        width: 100%;
        flex-shrink: 0;
      }
    }
  }
}
</style>
