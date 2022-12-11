/**
 * RLP - Recursive Length Prefix
 * Definition: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
 * 
 */
import { appendHexPrefix, EncodableType, hexToBytes, numberToHex, removeHexPrefix, toBytes } from "./utils";

const cutoffPoint = 55;
const stringOffset = 128;
const arrayOffset = 192;

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
    encodeLength: (len: number, offset: number) => {
        if (len <= cutoffPoint) {
            return Uint8Array.from([offset + len]);
        } else {
            const hexOfLength = numberToHex(len);
            const bytesInHexOfLength = hexOfLength.length / 2;
            const firstByte = numberToHex(offset + cutoffPoint + bytesInHexOfLength);
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
        if(byteLength === 1) {
            return Encoder.encodeString(appendHexPrefix(hexOfNumber));
        }
        const bytesArray = toBytes(appendHexPrefix(hexOfNumber));
        const lenEncoded = Encoder.encodeLength(byteLength, stringOffset);
        return Encoder._concat(lenEncoded, bytesArray);
    },
    encodeString: (input: string): Uint8Array => {
        const bytesArray = toBytes(input);
        if (bytesArray.length === 1 && bytesArray[0] < stringOffset) {
            return bytesArray;
        } else {
            const lenEncoded = Encoder.encodeLength(bytesArray.length, stringOffset);

            return Encoder._concat(lenEncoded, bytesArray);
        }
    },
    encodeArray: (input: Array<EncodableType>): Uint8Array => {
        if(input.length === 0) {
            return Uint8Array.from([0xc0]);
        }
        const encodedArray: Uint8Array[] = [];
        let totalLen = 0;
        input.forEach((item) => {
            const enc = Encoder.encode(item);
            encodedArray.push(enc);            
            totalLen += enc.length;
        });

        const flattened = new Uint8Array(totalLen);
        let offset = 0;
        encodedArray.forEach((item) => {
            flattened.set(item, offset);
            offset += item.length;
        });

        const lenEncoded = Encoder.encodeLength(totalLen, arrayOffset);
        return Encoder._concat(lenEncoded, flattened);
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
            return Encoder.encodeString("");
        } else {
            // it's an array
            return Encoder.encodeArray(input as Array<EncodableType>);
        }       
    },
};
