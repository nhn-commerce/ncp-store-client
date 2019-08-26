
const Validater = (valiInfos) => {
  this.valiInfos = valiInfos
}
const checkLengthFn = () => {
  let isBreak = false
  let hasError = false
  this.valiInfos.forEach((item) => {
    item.hasError = false
    if (!isBreak) {
      if (item.eqTarget) {
        if (item.inputValue !== item.eqTarget) {
          item.hasError = true
          item.message = item.eqTargetMessage
        }
      } else if (item.pattern) {
        if (!item.pattern.test(item.inputValue)) {
          item.hasError = true
        }
      } else if (item.length) {
        if (item.inputValue.length !== item.length) {
          item.hasError = true
        }
      } else if (item.minLength && item.maxLength) {
        if (item.inputValue.length < item.minLength || item.inputValue.length > item.maxLength) {
          item.hasError = true
        }
      } else if (item.minLength) {
        if (item.inputValue.length < item.minLength) {
          item.hasError = true
        }
      } else {
        if (item.inputValue.length > item.maxLength) {
          item.hasError = true
        }
      }
      if (item.hasError) {
        alert(item.message)
        isBreak = true
        hasError = true
        if (item.input) {
          item.input.focus()
        }
      }
    }
  })
  return hasError
}
Validater.prototype.validate = checkLengthFn

export default Validater

export function validateNumber (event) {
  const allowKeys = [46, 8, 9, 27, 13]
  if (allowKeys.includes(event.keyCode) ||
    // Allow: Ctrl + A/X/V/C
    (event.ctrlKey === true) ||
    // Allow: home, end, left, right, down, up
    (event.keyCode >= 35 && event.keyCode <= 40)) {
    // let it happen, don't do anything
    return
  }
  // Ensure that it is a number and stop the keypress
  // if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
  //   event.preventDefault()
  //   event.target.value = ''
  // }
  const telregx = /[\D]/g
  if (telregx.test(event.target.value)) {
    event.preventDefault()
    event.target.value = event.target.value.replace(telregx, '')
  }

  if (event.type === 'blur') {
    let value = changeKoreanToEmptyString(event.target.value)
    event.target.value = value
  }
}

export function changeKoreanToEmptyString (value) {
  let regx = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g
  if (regx.test(value)) {
    value = value.replace(regx, '')
  }
  let telregx = /[\D]/g
  if (telregx.test(event.target.value)) {
    value = value.replace(telregx, '')
  }
  return value
}
