<template>
  <div class="calendar-box">
    <h3 class="cw-title">{{ title }}</h3>
    <div class="calendar">
      <div class="cal-header">
        <button class="cal-nav" @click="prevMonth">‹</button>
        <span class="cal-month">{{ year }}年{{ month + 1 }}月</span>
        <button class="cal-nav" @click="nextMonth">›</button>
      </div>
      <div class="cal-weekdays">
        <span v-for="d in weekdays" :key="d">{{ d }}</span>
      </div>
      <div class="cal-days">
        <span
          v-for="(day, i) in days"
          :key="i"
          class="cal-day"
          :class="{
            'cal-day-empty': !day,
            'cal-day-has': day && hasPostOn(day),
            'cal-day-today': day === todayDate && month === todayMonth && year === todayYear
          }"
        >{{ day || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  postDates: { type: Array, default: () => [] },
  title: { type: String, default: '日历' }
})

const weekdays = ['一', '二', '三', '四', '五', '六', '日']

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())

const todayDate = now.getDate()
const todayMonth = now.getMonth()
const todayYear = now.getFullYear()

function prevMonth() {
  if (month.value === 0) { month.value = 11; year.value-- }
  else { month.value-- }
}

function nextMonth() {
  if (month.value === 11) { month.value = 0; year.value++ }
  else { month.value++ }
}

function hasPostOn(day) {
  return props.postDates.some(d => {
    const date = new Date(d)
    return date.getFullYear() === year.value &&
           date.getMonth() === month.value &&
           date.getDate() === day
  })
}

const days = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const result = []
  for (let i = 0; i < startOffset; i++) result.push(null)
  for (let d = 1; d <= daysInMonth; d++) result.push(d)
  return result
})
</script>

<style scoped>
.calendar-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-top: 20px;
  margin-bottom: 80px;
}

.cw-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.calendar { font-size: 0.8rem; }

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.cal-month { font-weight: 600; color: var(--text-primary); font-size: 0.85rem; }

.cal-nav {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px; color: var(--text-tertiary); font-size: 1rem;
  cursor: pointer; transition: all 0.15s;
  border: none; background: none; padding: 0; line-height: 1;
}

.cal-nav:hover { background: var(--bg-card); color: var(--accent); }

.cal-weekdays {
  display: grid; grid-template-columns: repeat(7, 1fr);
  text-align: center; margin-bottom: 4px;
  color: var(--text-muted); font-size: 0.7rem; font-weight: 600;
}

.cal-days {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 2px; text-align: center;
}

.cal-day {
  padding: 3px 0; font-size: 0.75rem;
  color: var(--text-secondary); border-radius: 4px;
}

.cal-day-empty { visibility: hidden; }

.cal-day-has {
  color: var(--accent); font-weight: 700; background: var(--accent-subtle);
}

.cal-day-today {
  font-weight: 700; color: #fff; background: var(--accent);
}
</style>
