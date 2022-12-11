/**
 * RLP - Recursive Length Prefix
 * Definition: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
 * 
 */
import { appendHexPrefix, EncodableType, hexToBytes, numberToHex, removeHexPrefix, toBytes } from "./utils";

const cutoffPoint = 55;
const stringOffset = 128;

export const Encoder = {
    _concat: (lenArray: Uint8Array, bytesArray: Uint8Array) => {
        const responseBytesArray = new Uint8Array(lenArray.length + bytesArray.length);
        [...lenArray, ...bytesArray].forEach((byte, i) => {
            responseBytesArray[i] = byte;
        });

        return responseBytesArray;
    },
    /**
     * Encodes the length of a string
     * @param len 
     * @returns the length of a string encoded to bytesArray
     */
    encodeLength: (len: number) => {
        if (len <= cutoffPoint) {
            return Uint8Array.from([stringOffset + len]);
        } else {
            const hexOfLength = numberToHex(len);
            const bytesInHexOfLength = hexOfLength.length / 2;
            const firstByte = numberToHex(stringOffset + cutoffPoint + bytesInHexOfLength);
            const allBytes = firstByte + hexOfLength;
            return Uint8Array.from(hexToBytes(allBytes));
        }
    },
    encodeNumber: (input: number | bigint) => {
        if(input === 0) {
            return Encoder.encodeString("");
        }
        const hexOfNumber = numberToHex(input);
        const byteLength = hexOfNumber.length / 2;
        const bytesArray = toBytes(appendHexPrefix(hexOfNumber));
        const lenEncoded = Encoder.encodeLength(byteLength);
        return Encoder._concat(lenEncoded, bytesArray);
    },
    encodeString: (input: string): Uint8Array => {
        const bytesArray = toBytes(input);
        if (bytesArray.length === 1 && bytesArray[0] < stringOffset) {
            return bytesArray;
        } else {
            const lenEncoded = Encoder.encodeLength(bytesArray.length);

            return Encoder._concat(lenEncoded, bytesArray);
        }
    },
    encode: (input: EncodableType) => {
        const inputType = typeof input;
        if (inputType === 'string') {
            return Encoder.encodeString(input as string);
        } else if (inputType === 'number' || inputType === 'bigint') {
            return Encoder.encodeNumber(input as number);
        } else if (input instanceof Uint8Array) {
            return input;
        } else if (input === null || input === undefined) {
            // treat like an empty string
            return Encoder.encodeString("");
        }

        return Uint8Array.from([]);
    },
};
