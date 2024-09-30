export const StorageKey = {
  CuBgImg: 'cur_bg_img',
  Mode: 'mode',
  SloganList: 'slogan_list',
  CurSlogan: 'cur_slogan',
  CurSloganColor: 'cur_slogan_color',
  CurSloganBgColor: 'cur_slogan_bg_color',
  CurMoodEmoji: 'cur_mood_emoji',
  TaskList: 'task_list'
}

export const isChrome = () => {
  if (typeof chrome.runtime === 'undefined') {
    return false
  }
  return true
}

export const setStorage = async (key: string, value: string) => {
  if (isChrome()) {
    await chrome.storage.local.set({ key: value })
    console.log('存储成功', key, value)
    return
  }
  localStorage.setItem(key, value)
}

export const getStorage = async (key: string): string => {
  if (isChrome()) {
    const res = await chrome.storage.local.get([`${key}`])
    console.log('获取成功', key)
    return res[key] as string
  }
  return localStorage.getItem(key) as string
}
