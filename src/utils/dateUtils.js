export function addDay (date, cnt, separator) {
  date = new Date(date.replace(/-/g, '/'))
  if (date.constructor !== Date) {
    return ''
  }

  date.setDate(date.getDate() + cnt)

  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day

  return reDate
}

export function addMonth (date, cnt, separator) {
  if (date.constructor !== Date) {
    return ''
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }

  let newDate = new Date(date.getFullYear(), date.getMonth() + cnt, date.getDate())
  const newDateEndDay = new Date(date.getFullYear(), date.getMonth() + cnt + 1, 0)
  if (newDate.getMonth() !== newDateEndDay.getMonth()) {
    newDate = newDateEndDay
  }
  let month = newDate.getMonth() + 1
  let day = newDate.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return newDate.getFullYear() + separator + month + separator + day
}

export function getStrDate (date, separator) {
  if (date.constructor !== Date) {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (date.constructor !== Date) {
    return ''
  }

  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day

  return reDate
}

export function getStrYMDHM (date, separator) {
  date = new Date(date.replace(/-/g, '/'))
  if (date.constructor !== Date) {
    return ''
  }

  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day + ' ' + hours + ':' + minutes

  return reDate
}

export function getStrYMDHMSS (date, separator) {
  if (date.constructor !== Date) {
    date = new Date(date.replace(/-/g, '/'))
  }

  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day + ' ' + hours + ':' + minutes + ':' + seconds

  return reDate
}

export function getToday () {
  return getStrDate(new Date())
}

export function getTodayTime () {
  return getStrYMDHMSS(new Date())
}

export function getFirstAndEndDay (mm, separator) {
  const nowdays = new Date()
  let year = nowdays.getFullYear()
  let month = nowdays.getMonth() + 1

  if (month <= mm) {
    year = year - 1
    month = month - mm + 12
  } else {
    month = month - mm
  }

  if (month < 10) {
    month = '0' + month
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }

  const startYmd = year + separator + month + separator + '01'

  const myDate = new Date(year, month, 0)
  const endYmd = year + separator + month + separator + myDate.getDate()

  return { startYmd, endYmd }
}

export function getSixMonths () {
  const sixMonths = []
  for (let index = 0; index < 6; index++) {
    const nowDate = new Date()
    const newDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - index, 1)
    sixMonths.push(newDate.getFullYear() + '년 ' + (newDate.getMonth() + 1) + '월')
  }
  return sixMonths
}

export function isYearEndDay () {
  const date = new Date()
  if (date.getMonth() === 11 && date.getDate() === 31) {
    return true
  } else {
    return false
  }
}

export function getJanuary5 () {
  const date = new Date()
  return (date.getFullYear() + 1) + '-01-05 23:59:59'
}

export function getEndDayForYear () {
  const date = new Date()
  return date.getFullYear() + '-12-31 23:59:59'
}

export function getStrMDW (date) {
  const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return (date.getMonth() + 1) + '.' + date.getDate() + ' ' + weeks[date.getDay()]
}

export function isOverDay (date) {
  const ONE_DAY = 1000 * 60 * 60 * 24
  const d = new Date(date.replace(/-/g, '/') + ' GMT+9') - new Date().getTime()
  return d > 0 && d <= ONE_DAY
}

export function within30Days (date) {
  const ONE_DAY = 1000 * 60 * 60 * 24 * 30
  const d = new Date(date.replace(/-/g, '/') + ' GMT+9') - new Date().getTime()
  return d > 0 && d <= ONE_DAY
}

export function getDateFormat (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))

    let y = slaDate.getFullYear()
    let m = slaDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = slaDate.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '년 ' + m + '월 ' + d + '일'
  }
}

export function getDateFormatMD (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))
    let m = slaDate.getMonth() + 1
    let d = slaDate.getDate()
    return m + '월 ' + d + '일 ' + ' 오픈예정'
  }
}

export function getDateFormatYMDHM (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))

    let y = slaDate.getFullYear()
    let m = slaDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = slaDate.getDate()
    d = d < 10 ? ('0' + d) : d
    let hours = slaDate.getHours()
    let minutes = slaDate.getMinutes()
    minutes = minutes < 10 ? ('0' + minutes) : minutes
    return y + '년 ' + m + '월 ' + d + '일' + (hours < 12 ? ' 오전 ' : ' 오후 ') + (hours < 12 ? hours : hours - 12) + ':' + minutes
  }
}

export function getDateFormatMDHM (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))
    let m = slaDate.getMonth() + 1
    let d = slaDate.getDate()
    let hours = slaDate.getHours()
    let minutes = slaDate.getMinutes()
    minutes = minutes < 10 ? ('0' + minutes) : minutes
    return m + '월 ' + d + '일' + (hours < 12 ? ' 오전 ' : ' 오후 ') + (hours < 12 ? hours : hours - 12) + ':' + minutes + ' 오픈예정'
  }
}

export function getDateFormatForAlert () {
  let slaDate = new Date()

  let y = slaDate.getFullYear()
  let m = slaDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = slaDate.getDate()
  d = d < 10 ? ('0' + d) : d
  let hours = slaDate.getHours()
  let minutes = slaDate.getMinutes()
  return y + '.' + m + '.' + d + ' ' + hours + ':' + minutes
}
