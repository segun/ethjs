export type EncodableType = string | number | bigint | Uint8Array | Array<EncodableType>;

/**
 * appends 0x to a string
 * @param input string to append 0x to
 * @returns 0x appended string if not already appended
 */
export const appendHexPrefix = (input: string) => {
    // append 0x to input if not already present
    if (isHexPrefixed(input)) {
        return input;
    }
    return '0x' + input;
}

/**
 * removes 0x from a string
 * @param input string to remove prefix from
 * @returns string without 0x
 */
export const removeHexPrefix = (input: string) => {
    if (isHexPrefixed(input)) {
        return input.slice(2);
    }
    return input;
}

/**
 * checks if string is 0x prefixed
 * @param input string to check
 * @returns true|false depending on if string is 0x prefixed or not
 */
export const isHexPrefixed = (input: string) => {
    return input.slice(0, 2) === '0x';
}

/**
 * converts a number to hex
 * @param input number to convert to hex
 * @returns hex string representation of number
 */
export const numberToHex = (input: number) => {
    const hex = input.toString(16);
    return isPadded(hex) ? hex : '0' + hex;
}

/**
 * pads an hex string with an extra 0 is the length of the string is odd
 * @param input string to pad
 * @returns an hex string of even length
 */
export const padHexString = (input: string) => {
    const hex = removeHexPrefix(input);
    return isPadded(input) ? hex : '0' + hex;
}

export const isPadded = (input: string) => {
    return input.length % 2 === 0;
}

export const hexToBytes = (input: string) => {
    const padded = padHexString(input);
    const numBytes = padded.length / 2;
    const byteArray = new Uint8Array(numBytes);
    // Split the string into 2 character chunks
    // https://stackoverflow.com/questions/37576685/using-regex-to-split-a-string-every-n-characters
    //
    // // Example:
    // // "1234567890".match(/.{1,2}/g);
    // // // Results in:
    // // ["12", "34", "56", "78", "90"]
    padded.match(/.{1,2}/g)!.forEach((byte, i) => {
        byteArray[i] = parseInt(byte, 16);
    });
    return byteArray;
}

export const toBytes = (input: EncodableType): Uint8Array => {
    if (typeof input === 'string') {
        if (isHexPrefixed(input)) {
            return hexToBytes(input);
        }
        return new TextEncoder().encode(input);
    }

    return new Uint8Array([]);
}

export const humanReadable = (input: Uint8Array) => {
    return [...input].map(byte => '0x' + byte.toString(16).padStart(2, '0')).join(',');
}