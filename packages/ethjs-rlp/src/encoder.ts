/**
 * RLP - Recursive Length Prefix
 * Definition: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
 * 
 */
import { appendHexPrefix, EncodableType, hexToBytes, numberToHex, removeHexPrefix, toBytes } from "./utils";

const cutoffPoint = 55;
const stringOffset = 128;

const Encoder = {
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
    encodeBuffer: (input: Buffer) => { },
    encodeString: (input: string): Uint8Array => {
        const bytesArray = toBytes(input);
        if (bytesArray.length === 1 && bytesArray[0] < stringOffset) {
            return bytesArray;
        } else {
            const lenEncoded =  Encoder.encodeLength(bytesArray.length);

            const responseBytesArray = new Uint8Array(lenEncoded.length + bytesArray.length);
            [...lenEncoded, ...bytesArray].forEach((byte, i) => {
                responseBytesArray[i] = byte;
            });

            return responseBytesArray;
        }
    },
    encode: (input: EncodableType) => {
        const inputType = typeof input;
        if (inputType === 'string') {
            return Encoder.encodeString(input as string);
        }
        if (input instanceof Array) {
            // return Encoder.encodeArray(input as Array<EncodableType>);
        }

        return Uint8Array.from([]);
    },
};

export default Encoder;
