import { Encoder } from "..";
import * as Utils from '../utils';

describe('Encoder', () => {
    describe('string encoder', () => {
        it('should encode a string single char', () => {
            const input = 'h';
            const expected = Uint8Array.from([104]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });
        it('should encode an empty string', () => {
            const input = '';
            const expected = Uint8Array.from([128]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });
        it('should encode encoded string 0', () => {
            const input = '0x00';
            const expected = Uint8Array.from([0]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });    
        it('should encode a string less than 55 char', () => {
            const input = 'hello world';
            // first byte is 128 + 11 = 139
            const expected = Uint8Array.from([139, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });
        it('should encode a string more than 55 char', () => {
            const input = 'a'.repeat(1024);
            // first byte is 183 + 2 = 185 (2 bytes to store the length of 1024 in bytes (0400))
            // next 2 bytes is 04, 00
            const expectedFirst3Bytes = Uint8Array.from([185, 4, 0]);
            const actual = Encoder.encode(input);
            expect(actual.slice(0, 3).join(',')).toBe(expectedFirst3Bytes.join(','));
        });    
    });

    describe('integer encoder', () => {
        it('should encode encoded integer of 1 byte', () => {
            const input = '0x0f';
            const expected = Uint8Array.from([15]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });        
        it('should encode integer that encodes to 1 byte', () => {
            const input = 127;
            const expected = Uint8Array.from([127]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });                
        it('should encode an integer', () => {
            const input = 1024;
            // first byte is 128 + 2 = 130
            const expected = Uint8Array.from([130, 4, 0]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });
        it('should encode 0', () => {
            const input = 0;
            const expected = Uint8Array.from([128]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });    
    });
    describe('undefined/null encoder', () => {
        it('should encode undefined', () => {
            const input = undefined;
            const expected = Uint8Array.from([128]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });        
        it('should encode null', () => {
            const input = undefined;
            const expected = Uint8Array.from([128]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });
    });

    describe('Uint8Array encoder', () => {
        it('should encode UintArray', () => {
            const input = Uint8Array.from([199, 192, 193, 192, 195, 192, 193, 192]);
            const expected = Uint8Array.from([199, 192, 193, 192, 195, 192, 193, 192]);
            const actual = Encoder.encode(input);
            expect(actual.join(',')).toBe(expected.join(','));
        });            
    });
    
    describe('array encoder', () => {
        it('should encode an array of strings', () => {
            // https://medium.com/coinmonks/data-structure-in-ethereum-episode-1-recursive-length-prefix-rlp-encoding-decoding-d1016832f919
            const actual = Encoder.encodeArray(["hello", "world"]);
            const expected = [0xcc, 0x85, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x85, 0x77, 0x6f, 0x72, 0x6c, 0x64];        
            expect(actual.join(',')).toBe(expected.join(','));                
        });
        it('should encode an array of empty arrays', () => {
            // https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/#examples
            const actual = Encoder.encodeArray([ [], [[]], [ [], [[]] ] ]);
            const expected = [199, 192, 193, 192, 195, 192, 193, 192];        
            expect(actual.join(',')).toBe(expected.join(','));
        });
        it('should encode an array of empty strings', () => {
            const actual = Encoder.encodeArray(["", "", [""]]);
            const expected = [196,128,128,193,128];        
            expect(actual.join(',')).toBe(expected.join(','));        
        });        
    });
});