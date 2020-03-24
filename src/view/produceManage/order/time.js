function toTime (date) {
  const d = new Date(date)
  const resDate = d.getFullYear() + '-' + p((d.getMonth() + 1)) + '-' + p(d.getDate())
  // const resTime = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())

  return resDate
}
function p (s) {
  return s < 10 ? '0' + s : s
}

export default toTime
