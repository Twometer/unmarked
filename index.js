const fs = require('fs')
const { toMarkdown } = require('./lib/converter')

let testFile = fs.readFileSync('./test_data/input.html', { encoding: 'utf-8' })
let md = toMarkdown(testFile)
fs.writeFileSync('./test_data/output.md', md)
