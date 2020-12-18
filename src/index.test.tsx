import { FullScreen, useFullScreenHandle } from '.';

describe('exports', () => {
  it('exports component', () => {
    expect(FullScreen).toBeTruthy();
  });

  it('exports hook', () => {
    expect(useFullScreenHandle).toBeTruthy();
  });
});
