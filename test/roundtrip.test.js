const fs = require('fs')
const marked = require('marked')
const { toMarkdown } = require('../lib/converter')

test('round trip is equal', () => {
    let file = fs.readFileSync('test/bench.md', { encoding: 'utf-8' })
    let baseline = marked.parse(file)
    let reconstructed = toMarkdown(baseline)
    let validation = marked.parse(reconstructed)

    fs.writeFileSync('test_data/result.md', reconstructed)

    expect(validation).toBe(baseline)
})
