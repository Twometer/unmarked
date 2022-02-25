function isSpecialChar(chr) {
    return ['~', '_', '*', '`'].includes(chr)
}

class Buffer {
    constructor() {
        this.buf = ''
    }

    append(str, escape) {
        for (let chr of str) {
            if (chr == '\r' || chr == '\0') continue
            if (escape && isSpecialChar(chr)) this.buf += '\\'
            this.buf += chr
        }
        return this
    }

    appendMultiple(num, str, escape) {
        for (let i = 0; i < num; i++) this.append(str, escape)
    }

    appendln(str, escape) {
        if (str) this.append(str, escape)
        while (!this.buf.endsWith('\n')) this.buf += '\n'
        return this
    }

    toString() {
        return this.buf.trim()
    }
}

module.exports = { Buffer }
