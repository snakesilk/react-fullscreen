import React, { useEffect, useState } from 'react';
import fscreen from 'fscreen';
import renderer from 'react-test-renderer'; // ES6
import {
  act,
  renderHook,
  RenderHookResult,
} from '@testing-library/react-hooks';
import { FullScreen, FullScreenHandle, useFullScreenHandle } from '.';

jest.mock('fscreen');

describe('exports', () => {
  it('exports component', () => {
    expect(FullScreen).toBeTruthy();
  });

  it('exports hook', () => {
    expect(useFullScreenHandle).toBeTruthy();
  });
});

describe('useFullScreenHandle', () => {
  let hook: RenderHookResult<unknown, FullScreenHandle>;
  const mockNode = Symbol('fake node');

  beforeEach(() => {
    fscreen.fullscreenElement = undefined;
    fscreen.addEventListener = jest.fn();
    fscreen.removeEventListener = jest.fn();
    fscreen.exitFullscreen = jest.fn(() => Promise.resolve());
    fscreen.requestFullscreen = jest.fn(() => Promise.resolve());
  });

  describe('when mounted', () => {
    let listener: () => void;
    beforeEach(() => {
      hook = renderHook(() => useFullScreenHandle());
      hook.result.current.node.current = (mockNode as unknown) as HTMLDivElement;
      listener = fscreen.addEventListener.mock.calls[0][1];
    });

    it('returns same handle ref between renders', () => {
      const ref = hook.result.current;

      hook.rerender();

      expect(hook.result.current).toBe(ref);
    });

    it('has active flag set to false', () => {
      expect(hook.result.current.active).toBe(false);
    });

    it('listens to fullscreen change', () => {
      expect(fscreen.addEventListener).toHaveBeenCalledTimes(1);
      expect(fscreen.addEventListener).toHaveBeenCalledWith(
        'fullscreenchange',
        expect.any(Function),
      );
    });

    describe('and fullscreen event fires on current handle', () => {
      beforeEach(() => {
        fscreen.fullscreenElement = mockNode;
        act(() => {
          listener();
        });
      });

      it('active flag is set to true', () => {
        expect(hook.result.current.active).toBe(true);
      });
    });

    describe('and fullscreen event fires on other handle', () => {
      beforeEach(() => {
        fscreen.fullscreenElement = Symbol('other fake node');
        act(() => {
          listener();
        });
      });

      it('active flag is set to false', () => {
        expect(hook.result.current.active).toBe(false);
      });
    });

    describe('and enter() called', () => {
      beforeEach(async () => {
        await act(async () => {
          hook.result.current.enter();
        });
      });

      it('calls fscreen.requestFullscreen with node', () => {
        expect(fscreen.requestFullscreen).toHaveBeenCalledTimes(1);
        expect(fscreen.requestFullscreen).toHaveBeenCalledWith(mockNode);
      });
    });

    describe('and enter() fails', () => {
      const mockError = new Error('Full sceen failed');
      let caughtError: Error;

      beforeEach(async () => {
        fscreen.requestFullscreen = () => Promise.reject(mockError);

        await act(() => {
          return hook.result.current
            .enter()
            .catch((error) => (caughtError = error));
        });
      });

      it('error can be caught', () => {
        expect(caughtError).toBe(mockError);
      });
    });

    describe('when entered', () => {
      beforeEach(() => {
        fscreen.fullscreenElement = mockNode;
      });

      describe('and enter() called', () => {
        beforeEach(async () => {
          await act(async () => {
            hook.result.current.enter();
          });
        });

        it('calls fscreen.exitFullscreen', () => {
          expect(fscreen.exitFullscreen).toHaveBeenCalledTimes(1);
        });

        it('calls fscreen.requestFullscreen', () => {
          expect(fscreen.requestFullscreen).toHaveBeenCalledTimes(1);
        });
      });

      describe('and exit() called', () => {
        beforeEach(async () => {
          await act(async () => {
            hook.result.current.exit();
          });
        });

        it('calls fscreen.exitFullscreen', () => {
          expect(fscreen.exitFullscreen).toHaveBeenCalledTimes(1);
        });

        it('does not call fscreen.requestFullscreen', () => {
          expect(fscreen.requestFullscreen).toHaveBeenCalledTimes(0);
        });
      });

      describe('and exit() fails', () => {
        const mockError = new Error('Exit full sceen failed');
        let caughtError: Error;

        beforeEach(async () => {
          fscreen.exitFullscreen = () => Promise.reject(mockError);

          await act(() => {
            return hook.result.current
              .exit()
              .catch((error) => (caughtError = error));
          });
        });

        it('error can be caught', () => {
          expect(caughtError).toBe(mockError);
        });
      });
    });

    describe('and exit() called', () => {
      beforeEach(async () => {
        await act(async () => {
          hook.result.current.exit();
        });
      });

      it('does not call fscreen.exitFullscreen', () => {
        expect(fscreen.exitFullscreen).toHaveBeenCalledTimes(0);
      });
    });

    describe('when unmounted', () => {
      beforeEach(() => {
        hook.unmount();
      });

      it('has removed its event listener', () => {
        expect(hook.result.current.active).toBe(false);
      });

      it('listens to fullscreen change', () => {
        expect(fscreen.removeEventListener).toHaveBeenCalledTimes(1);
        expect(fscreen.removeEventListener).toHaveBeenCalledWith(
          'fullscreenchange',
          listener,
        );
      });
    });
  });
});

describe('FullScreen component', () => {
  it('handles undefined className gracefully', () => {
    const Comp = () => {
      const handle = useFullScreenHandle();
      return <FullScreen handle={handle} />;
    };

    const component = renderer.create(<Comp />);
    const element = component.root.findByType('div');

    expect(element.props.className).toBe('fullscreen');
  });

  it('applies custom className', () => {
    const Comp = () => {
      const handle = useFullScreenHandle();
      return <FullScreen className='my-custom-class' handle={handle} />;
    };

    const component = renderer.create(<Comp />);
    const element = component.root.findByType('div');

    expect(element.props.className).toBe('my-custom-class fullscreen');
  });

  it('applies active class when active', async () => {
    const hook = renderHook(() => useFullScreenHandle());
    hook.result.current.active = true;

    const component = renderer.create(
      <FullScreen handle={hook.result.current} />,
    );

    const element = component.root.findByType('div');
    expect(element.props.className).toBe('fullscreen fullscreen-enabled');
  });
});
