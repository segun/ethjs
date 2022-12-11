import { Encoder } from "..";

describe.only('Encoder', () => {
    it('should encode a string single char', () => {
        const input = 'h';
        const expected = new Uint8Array([104]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });
    it('should encode an empty string', () => {
        const input = '';
        const expected = new Uint8Array([128]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });
    it('should encode encoded string 0', () => {
        const input = '0x00';
        const expected = new Uint8Array([0]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });    
    it('should encode encoded integer of 1 byte', () => {
        const input = '0x0f';
        const expected = new Uint8Array([15]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });        
    it('should encode a string less than 55 char', () => {
        const input = 'hello world';
        // first byte is 128 + 11 = 139
        const expected = new Uint8Array([139, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });
    it('should encode a string more than 55 char', () => {
        const input = 'a'.repeat(1024);
        // first byte is 183 + 2 = 185 (2 bytes to store the length of 1024 in bytes (0400))
        // next 2 bytes is 04, 00
        const expectedFirst3Bytes = new Uint8Array([185, 4, 0]);
        const actual = Encoder.encode(input);
        expect(actual.slice(0, 3).join(',')).toBe(expectedFirst3Bytes.join(','));
    });
    it('encode an integer', () => {
        const input = 1024;
        // first byte is 128 + 2 = 130
        const expected = new Uint8Array([130, 4, 0]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });
    it('encode 0', () => {
        const input = 0;
        const expected = new Uint8Array([128]);
        const actual = Encoder.encode(input);
        expect(actual.join(',')).toBe(expected.join(','));
    });    
});