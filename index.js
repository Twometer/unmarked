const fs = require('fs')
const domino = require('domino')

function parseHtml(html) {
    let window = domino.createWindow(html)
    return window.document
}

function traverseChildren(c, node) {
    for (let child of node.childNodes) {
        traverseTree(c, child)
    }
}

function traverseList(c, node, ordered) {
    let num = 0
    for (let child of node.childNodes) {
        if (child.nodeName == 'LI') {
            if (ordered) c.buf += `${++num}. `
            else c.buf += '- '
            traverseChildren(c, child)
            c.buf += '\n'
        }
    }
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

function isBlank(str) {
    for (let char of str) {
        if (![' ', '\t', '\r', '\n'].includes(char)) return false
    }
    return true
}

function hasParentOfType(node, type) {
    do {
        if (node.nodeName == type) return true
        node = node.parentNode
    } while (node != null)
    return false
}

function traverseTree(c, node) {
    let isPre = hasParentOfType(node, 'PRE')
    let isWhitespaceSignificant = isPre || !hasParentOfType(node, 'TABLE')

    switch (node.nodeName) {
        case '#text':
            if (isWhitespaceSignificant || !isBlank(node.data)) c.buf += node.data
            break
        case 'A':
            c.buf += '['
            traverseChildren(c, node)
            c.buf += `](${node.attributes.href.data})`
            break
        case 'H6':
            c.buf += '#'
        case 'H5':
            c.buf += '#'
        case 'H4':
            c.buf += '#'
        case 'H3':
            c.buf += '#'
        case 'H2':
            c.buf += '#'
        case 'H1':
            c.buf += '# '
            traverseChildren(c, node)
            c.buf += '\n'
            break
        case 'IMG':
            let title = node.attributes.title || node.attributes.alt
            let titleStr = title?.data || ''
            c.buf += `![${titleStr}](${node.attributes.src.data})`
            break
        case 'P':
            while (!c.buf.endsWith('\n\n')) c.buf += '\n'
            traverseChildren(c, node)
            c.buf += '\n'
            break
        case 'CODE':
            if (isPre) {
                let language = node.attributes.class?.data.match(/language-([0-9A-z]+)/)

                c.buf += '```'
                if (language) c.buf += language[1]
                c.buf += '\n'

                traverseChildren(c, node)
                c.buf += '```\n'
            } else {
                c.buf += '`'
                traverseChildren(c, node)
                c.buf += '`'
            }
            break
        case 'UL':
            traverseList(c, node, false)
            break
        case 'OL':
            traverseList(c, node, true)
            break
        case 'HR':
            c.buf += '\n---\n'
            break
        case 'INPUT':
            if (node.attributes.type.data == 'checkbox') {
                c.buf += '['
                c.buf += !!node.attributes.checked ? 'x' : ' '
                c.buf += '] '
            }
            break
        case 'THEAD':
            traverseChildren(c, node)
            c.buf += '|'
            for (let header of parseTableHeaders(node)) {
                switch (header.align) {
                    case 'left':
                        c.buf += ':--- |'
                        break
                    case 'right':
                        c.buf += ' ---:|'
                        break
                    default:
                        c.buf += ' --- |'
                }
            }
            c.buf += '\n'
            break
        case 'TR':
            c.buf += '|'
            traverseChildren(c, node)
            c.buf += '\n'
            break
        case 'TH':
        case 'TD':
            c.buf += ' '
            traverseChildren(c, node)
            c.buf += ' |'
            break
        default:
            traverseChildren(c, node)
    }
}

function toMarkdown(testFile) {
    let c = { buf: '' }
    let doc = parseHtml(testFile)
    traverseTree(c, doc)
    return c.buf
}

let testFile = fs.readFileSync('./test_data/input.html', { encoding: 'utf-8' })
let md = toMarkdown(testFile)
fs.writeFileSync('./test_data/output.md', md)
