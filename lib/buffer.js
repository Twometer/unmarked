class Buffer {
    constructor() {
        this.buf = ''
    }

    append(str) {
        for (let chr of str) {
            if (chr == '\r' || chr == '\0') continue
            this.buf += chr
        }
        return this
    }

    appendln(str) {
        if (str) this.append(str)
        while (!this.buf.endsWith('\n')) this.buf += '\n'
        return this
    }

    toString() {
        return this.buf.trim()
    }
}

module.exports = { Buffer }
