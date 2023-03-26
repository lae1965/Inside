import { ref, watch, type Ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export class IdleTimer {
  lastActionTime: Ref<number>
  timeoutMs: number
  private resetTimer: () => void
  private clearTimer: () => void
  private timeoutCallback: () => void
  private timerHandle: ReturnType<typeof useTimeoutFn>

  constructor(timeoutMs: number, timeoutCallback: () => void) {
    this.lastActionTime = ref(0)
    this.timeoutMs = timeoutMs
    this.timeoutCallback = timeoutCallback

    this.timerHandle = useTimeoutFn(() => {
      this.lastActionTime.value = timeoutMs / 1000
    }, timeoutMs)

    this.resetTimer = this.timerHandle.start
    this.clearTimer = this.timerHandle.stop

    this.updateLastActionTime = this.updateLastActionTime.bind(this)
    this.updateLastActionTime()

    window.addEventListener('mousedown', this.updateLastActionTime)
    window.addEventListener('mouseup', this.updateLastActionTime)
    window.addEventListener('mousemove', this.updateLastActionTime)
    window.addEventListener('keydown', this.updateLastActionTime)
    this.resetTimer()

    this.watchLastActionTime()
  }

  updateLastActionTime() {
    this.lastActionTime.value = 0
    this.resetTimer()
  }

  watchLastActionTime() {
    watch(this.lastActionTime, (value) => {
      if (value === this.timeoutMs / 1000) {
        this.timeoutCallback()
      }
    })
  }

  destroy() {
    window.removeEventListener('mousedown', this.updateLastActionTime)
    window.removeEventListener('mouseup', this.updateLastActionTime)
    window.removeEventListener('mousemove', this.updateLastActionTime)
    window.removeEventListener('keydown', this.updateLastActionTime)
    this.clearTimer()
  }
}
