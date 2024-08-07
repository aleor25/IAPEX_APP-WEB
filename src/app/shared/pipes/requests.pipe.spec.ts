import { RequestsPipe } from './requests.pipe';

describe('RequestsPipe', () => {
  it('create an instance', () => {
    const pipe = new RequestsPipe();
    expect(pipe).toBeTruthy();
  });
});
