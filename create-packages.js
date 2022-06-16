const fs = require('fs')
const path = require('path')

const package = require('./package.json')

const TYPE_MAP = {
  main: 'commonjs',
  module: 'module'
}

function createModulePackage(type) {
  const folder = path.dirname(package[type])
  fs.writeFileSync(
    path.join(folder, 'package.json'),
    JSON.stringify({ type: TYPE_MAP[type] }, null, 2)
  )
}

createModulePackage('main')
createModulePackage('module')