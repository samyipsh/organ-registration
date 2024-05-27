
const Base64CharConversion = (function() {
    var digitsStr = 
    //   0       8       16      24      32      40      48      56     63
    //   v       v       v       v       v       v       v       v      v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    var digits = digitsStr.split('');
    var digitsMap = new Map<string, number>(); // reverse mapping of base64 char to decimal (0-63)
    for (var i = 0; i < digits.length; i++) {
        digitsMap.set(digits[i], i);
    }
    return {
        // 6 digit binary string
        fromBinaryStr: function(binaryStr: string) {
            console.assert(binaryStr.length === 6, "Binary string must be 6 characters long: " + binaryStr);
            return digits[parseInt(binaryStr, 2)];
        },
        toBinaryStr: function(base64Char: string) {
            console.assert(base64Char.length === 1, "Base64 char must be 1 character long");
            const decimalNum = digitsMap.get(base64Char);
            if (decimalNum === undefined) {
                throw new Error(`Base64 char "${base64Char}" not found in digitsMap`);
            }
            return decimalNum.toString(2).padStart(6, '0');
        }
    };
})();

// for a fixed len of binary string so num of padding bits stored

export const Base64Conversion = class {
    static numPaddingBits = 0;
    static BASE_64_BITS: number = 6;

    static encode(binaryStr: string) {
        const len = binaryStr.length;
        Base64Conversion.numPaddingBits = Base64Conversion.BASE_64_BITS - (len % Base64Conversion.BASE_64_BITS)
        const paddedBinaryStr = binaryStr + "0".repeat(Base64Conversion.numPaddingBits);

        var base64Str = "";
        for (var i = 0; i < paddedBinaryStr.length; i += 6) {
            base64Str += Base64CharConversion.fromBinaryStr(paddedBinaryStr.slice(i, i + 6));
        }
        return base64Str;
    }

    decode(base64Str: string) {
        var binaryStr = "";
        for (var i = 0; i < base64Str.length; i++) {
            binaryStr += Base64CharConversion.toBinaryStr(base64Str[i]);
        }
        return binaryStr.slice(0, binaryStr.length - Base64Conversion.numPaddingBits);
    }
}
