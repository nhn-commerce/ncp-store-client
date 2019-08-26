const fs = require('fs')
const path = require('path')
const axios = require('axios')
const yaml = require('js-yaml')

const swaggerApiDocUrl = 'http://alpha-api.e-ncp.com/v2/api-docs'

axios.get(swaggerApiDocUrl).then(res => {
  res.data.tags = res.data.tags.sort((a, b) => a.name > b.name ? 1 : -1)
  fs.writeFile(path.join(__dirname, 'apidoc.yaml'), yaml.safeDump(res.data), (err) => {
    if (err) throw err
    console.log('`apidoc.yaml` has been saved.')
  })
}, err => {
  console.log(err)
})
