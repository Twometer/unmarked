const { Buffer } = require('./buffer')
const { parseHtml, hasParentOfType } = require('./html')

function isStringBlank(str) {
    for (let char of str) {
        if (![' ', '\t', '\r', '\n'].includes(char)) return false
    }
    return true
}

function parseTableHeaders(node) {
    let headers = []
    for (let child of node.childNodes) {
        switch (child.nodeName) {
            case 'TD':
            case 'TH':
                headers.push({
                    align: child.attributes.align?.data,
                })
                break
            default:
                headers.push(...parseTableHeaders(child))
        }
    }
    return headers
}

function processList(buf, node, ordered, listLevel) {
    buf.append('\n')
    let num = 0
    for (let child of node.childNodes) {
        if (child.nodeName == 'LI') {
            buf.appendMultiple(listLevel, '  ')
            if (ordered) buf.append(`${++num}. `)
            else buf.append('- ')
            processChildren(buf, child, listLevel + 1)
            buf.append('\n')
        }
    }
}

function processChildren(buf, node, listLevel) {
    for (let child of node.childNodes) {
        processNode(buf, child, listLevel)
    }
}

function processNode(buf, node, listLevel) {
    let isPre = hasParentOfType(node, 'PRE')
    let isTable = hasParentOfType(node, 'TABLE')
    let isWhitespaceSignificant = !isTable || isPre

    switch (node.nodeName) {
        case '#text':
            if (isWhitespaceSignificant || !isStringBlank(node.data)) buf.append(node.data, true)
            break
        case 'EM':
            buf.append('_')
            processChildren(buf, node)
            buf.append('_')
            break
        case 'STRONG':
            buf.append('**')
            processChildren(buf, node)
            buf.append('**')
            break
        case 'P':
            buf.appendln()
            processChildren(buf, node)
            buf.appendln()
            break
        case 'A':
            buf.append('[')
            processChildren(buf, node)
            buf.append(`](${node.attributes.href.data})`)
            break
        case 'IMG':
            let title = node.attributes.title || node.attributes.alt
            let titleStr = title?.data || ''
            buf.append(`![${titleStr}](${node.attributes.src.data})`)
            break
        case 'H6':
            buf.append('#')
        case 'H5':
            buf.append('#')
        case 'H4':
            buf.append('#')
        case 'H3':
            buf.append('#')
        case 'H2':
            buf.append('#')
        case 'H1':
            buf.append('# ')
            processChildren(buf, node)
            buf.appendln()
            break
        case 'HR':
            buf.appendln().appendln('---')
            break
        case 'UL':
            processList(buf, node, false, listLevel || 0)
            break
        case 'OL':
            processList(buf, node, true, listLevel || 0)
            break
        case 'INPUT':
            if (node.attributes.type.data == 'checkbox') {
                buf.append(`[${!!node.attributes.checked ? 'x' : ' '}]`)
            }
            break
        case 'CODE':
            if (isPre) {
                let languageMatch = node.attributes.class?.data.match(/language-([0-9A-z]+)/)
                let language = languageMatch ? languageMatch[1] : ''
                buf.append('```').append(language).append('\n')
                processChildren(buf, node)
                buf.appendln('```')
            } else {
                buf.append('`')
                processChildren(buf, node)
                buf.append('`')
            }
            break
        case 'THEAD':
            processChildren(buf, node)
            buf.append('|')
            for (let header of parseTableHeaders(node)) {
                switch (header.align) {
                    case 'left':
                        buf.append(':--- |')
                        break
                    case 'right':
                        buf.append(' ---:|')
                        break
                    default:
                        buf.append(' --- |')
                }
            }
            buf.append('\n')
            break
        case 'TR':
            buf.append('|')
            processChildren(buf, node)
            buf.append('\n')
            break
        case 'TH':
        case 'TD':
            buf.append(' ')
            processChildren(buf, node)
            buf.append(' |')
            break
        default:
            processChildren(buf, node)
    }
}

function toMarkdown(html) {
    let buf = new Buffer()
    let doc = parseHtml(html)
    processNode(buf, doc)
    return buf.toString()
}

module.exports = { toMarkdown }
