import * as Utils from '../utils';

describe('Testing Utilities Function', () => {
  it('should append hex prefix', () => {
    const input = '1234567890';

    let result = Utils.appendHexPrefix(input);
    expect(result).toBe('0x' + input);

    result = Utils.appendHexPrefix(result);
    expect(result).toBe('0x' + input);
  });

  it('should remove hex prefix', () => {
    const input = '0x1234567890';

    let result = Utils.removeHexPrefix(input);
    expect(result).toBe(input.slice(2));

    result = Utils.removeHexPrefix(result);
    expect(result).toBe(input.slice(2));
  });

  it('should check if hex prefixed', () => {
    const input = '0x1234567890';

    let result = Utils.isHexPrefixed(input);
    expect(result).toBe(true);

    result = Utils.isHexPrefixed(input.slice(2));
    expect(result).toBe(false);
  });

  it('should convert number to hex', () => {
    let input = 12;

    let result = Utils.numberToHex(input);
    expect(result).toBe(input.toString(16).padStart(2, '0'));

    input = 123;
    result = Utils.numberToHex(input);
    expect(result).toBe(input.toString(16));
  });

  it('should pad hex string', () => {
    let input = '0x123';

    let result = Utils.padHexString(input);
    expect(result).toBe("0123");

    input = '12';
    result = Utils.padHexString(input);
    expect(result).toBe('12');
  });

  it('should check if padded', () => {
    let input = '0x123';

    let result = Utils.isPadded(input);
    expect(result).toBe(false);

    input = '234';
    result = Utils.isPadded(input);
    expect(result).toBe(false);        

    input = '0x1234';
    result = Utils.isPadded(input);
    expect(result).toBe(true);

    input = '0x0234';
    result = Utils.isPadded(input);
    expect(result).toBe(true);    

    input = '0234';
    result = Utils.isPadded(input);
    expect(result).toBe(true);        
  });

  it('should convert hex to bytes', () => {
    let input = '0x1234';
    let result = Utils.hexToBytes(input);
    expect(result).toEqual(Uint8Array.from([0x12, 0x34]));

    input = '0xb9f';
    result = Utils.hexToBytes(input);
    expect(result).toEqual(Uint8Array.from([11, 159]));    

    input = '1234';
    result = Utils.hexToBytes(input);
    expect(result).toEqual(Uint8Array.from([0x12, 0x34]));    

    input = '234';
    result = Utils.hexToBytes(input);
    expect(result).toEqual(Uint8Array.from([0x02, 0x34]));        
  });

  it('should convert to bytes', () => {
    let input = 'hello world';
    let result = Utils.toBytes(input);
    expect(result).toEqual(Uint8Array.from([104,101,108,108,111,32,119,111,114,108,100]));

    input = '0xb9f';
    result = Utils.toBytes(input);
    expect(result).toEqual(Uint8Array.from([11, 159]));    

    let arrInput = [1,2,3];
    result = Utils.toBytes(arrInput);
    expect(result).toEqual(Uint8Array.from([]));    

    input = '1234';
  });

  it('return human readable', () => {
    const input = 'hello world';

    const result = Utils.humanReadable(Utils.toBytes(input));
    expect(result).toBe("0x68,0x65,0x6c,0x6c,0x6f,0x20,0x77,0x6f,0x72,0x6c,0x64");
  });
});
