import { MaskPipe } from './mask.pipe';

describe('MaskPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskPipe();
    expect(pipe).toBeTruthy();
  });

  it('should work', () => {
    const pipe = new MaskPipe();
    expect(pipe.transform('aaaaaaaa', 4)).toEqual('aaaa ... aaaa');
  });
});
