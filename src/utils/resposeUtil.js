const responseUtil = (res, statusCode, data, error = false) => {
  const name = error ? 'error' : 'items'
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = statusCode
  res.write(JSON.stringify({
    status: statusCode,
    [name]: data
  }))
  res.end()
}

module.exports = responseUtil
