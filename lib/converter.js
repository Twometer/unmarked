const { Buffer } = require('./buffer')
const { parseHtml, isOrHasParentOfType, hasParentOfType } = require('./html')

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

function processList(buf, node, ordered, ctx) {
    buf.maybeAppend('\n')
    let num = 0
    for (let child of node.childNodes) {
        if (child.nodeName == 'LI') {
            buf.appendMultiple(ctx.listLevel, '  ')
            if (ordered) buf.append(`${++num}. `)
            else buf.append('- ')
            ctx.listLevel++
            processChildren(buf, child, ctx)
            ctx.listLevel--
            buf.maybeAppend('\n')
        }
    }
}

function processChildren(buf, node, ctx) {
    for (let child of node.childNodes) {
        processNode(buf, child, ctx)
    }
}

function processNode(buf, node, ctx) {
    let isPre = isOrHasParentOfType(node, 'PRE')
    let isTable = isOrHasParentOfType(node, 'TABLE')
    let isWhitespaceSignificant = !isTable || isPre

    switch (node.nodeName) {
        case '#text':
            if (isWhitespaceSignificant || !isStringBlank(node.data)) buf.append(node.data, true)
            break
        case 'EM':
            buf.append('_')
            processChildren(buf, node, ctx)
            buf.append('_')
            break
        case 'STRONG':
            buf.append('**')
            processChildren(buf, node, ctx)
            buf.append('**')
            break
        case 'DEL':
            buf.append('~~')
            processChildren(buf, node, ctx)
            buf.append('~~')
            break
        case 'P':
            buf.appendln()
            processChildren(buf, node, ctx)
            buf.appendln()
            break
        case 'A':
            buf.append('[')
            processChildren(buf, node, ctx)
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
            processChildren(buf, node, ctx)
            buf.appendln()
            break
        case 'HR':
            buf.appendln().appendln('---')
            break
        case 'UL':
            processList(buf, node, false, ctx)
            break
        case 'OL':
            processList(buf, node, true, ctx)
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
                processChildren(buf, node, ctx)
                buf.appendln('```')
            } else {
                buf.append('`')
                processChildren(buf, node, ctx)
                buf.append('`')
            }
            break
        case 'TR':
            buf.append('|')
            processChildren(buf, node, ctx)
            buf.append('\n')

            // After the first row, print the MD table theader
            ctx.rowNum++
            if (ctx.rowNum == 1) {
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
            }
            break
        case 'TH':
        case 'TD':
            buf.append(' ')
            processChildren(buf, node, ctx)
            buf.append(' |')
            break
        case 'BR':
            buf.append('  \n')
            break
        case 'TABLE':
            // Nested tables are not supported!
            if (hasParentOfType(node, 'TABLE')) {
                console.warn('Nested tables are not supported by unmarked.js')
                return
            }
            ctx.rowNum = 0
        default:
            processChildren(buf, node, ctx)
    }
}

function toMarkdown(html) {
    let buf = new Buffer()
    let doc = parseHtml(html)
    let ctx = {
        listLevel: 0,
        rowNum: 0,
    }
    processNode(buf, doc, ctx)
    return buf.toString()
}

module.exports = { toMarkdown }
