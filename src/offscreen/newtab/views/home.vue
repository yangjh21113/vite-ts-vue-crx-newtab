<template>
  <div class="home-container">
    <div class="header">好好学习</div>
    <div class="content-wapper">
      <div class="time-box">{{ curTime }}</div>
    </div>
    <div class="bottom">天天向上</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const curTime = ref('')
const router = useRouter()

const updateTime = () => {
  curTime.value = moment().format('Y-MM-D HH-mm-ss')
  setTimeout(() => {
    updateTime()
  }, 1000)
}
updateTime()
</script>
<style lang="scss">
.home-container {
  width: 100%;
  height: 100%;
  background: #333;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 24px;
    background: #444;
    color: #fff;
  }
  .content-wapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    .time-box {
      font-size: 24px;
      color: #fff;
    }
  }
  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 24px;
    color: #fff;
    background: #444;
  }
}
</style>
