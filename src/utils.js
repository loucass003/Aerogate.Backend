export function convertBase(num) {
    return {
        from : (baseFrom) => {
            return {
                to : (baseTo) => {
                    return parseInt(num, baseFrom).toString(baseTo);
                }
            };
        }
    };
};

export function getBinary(buf, start, end) {
    return buf.filter((byte, i) => i >= start && i < end);
}

export function byteArrayToInt(buf) {
    let string = '';
    buf.forEach((byte) => {
        string += byte
    });
    return parseInt(parseInt(string, 2).toString(10));
}
