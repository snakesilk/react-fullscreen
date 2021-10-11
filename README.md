# React Fullscreen

A React component that sets its children to fullscreen using the Fullscreen API, normalized using [fscreen](https://github.com/rafrex/fscreen).

## Usage

### * Install.
```bash
yarn add react-full-screen
```

### * Import component and hook
```js
import { FullScreen, useFullScreenHandle } from "react-full-screen";
```

### * Setup and render.

You **must** use one handle per full screen element.
It is not possible to start in Fullscreen. Fullscreen must be enabled from a user action such as `onClick`.

```jsx
import React, {useCallback} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  const handle = useFullScreenHandle();

  return (
    <div>
      <button onClick={handle.enter}>
        Enter fullscreen
      </button>

      <FullScreen handle={handle}>
        Any fullscreen content here
      </FullScreen>
    </div>
  );
}

export default App;
```

When you have many elements you need one handle per element.
```jsx
import React, {useCallback} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  const screen1 = useFullScreenHandle();
  const screen2 = useFullScreenHandle();

  const reportChange = useCallback((state, handle) => {
    if (handle === screen1) {
      console.log('Screen 1 went to', state, handle);
    }
    if (handle === screen2) {
      console.log('Screen 2 went to', state, handle);
    }
  }, [screen1, screen2]);

  return (
    <div>
      <button onClick={screen1.enter}>
        First
      </button>

      <button onClick={screen2.enter}>
        Second
      </button>

      <FullScreen handle={screen1} onChange={reportChange}>
        <div className="full-screenable-node" style={{background: "red"}}>
          First
          <button onClick={screen2.enter}>
            Switch
          </button>
          <button onClick={screen1.exit}>
            Exit
          </button>
        </div>
      </FullScreen>

      <FullScreen handle={screen2} onChange={reportChange}>
        <div className="full-screenable-node" style={{background: "green"}}>
          Second
          <button onClick={screen1.enter}>
            Switch
          </button>
          <button onClick={screen2.exit}>
            Exit
          </button>
        </div>
      </FullScreen>
    </div>
  );
}

export default App;
```

## Types

```ts
interface FullScreenHandle {
  active: boolean;
  // Specifies if attached element is currently full screen.

  enter: () => Promise<void>;
  // Requests this element to go full screen.

  exit: () => Promise<void>;
  // Requests this element to exit full screen.

  node: React.MutableRefObject<HTMLDivElement | null>;
  // The attached DOM node
}
```

```ts
interface FullScreenProps {
  handle: FullScreenHandle;
  // Handle that helps operate the full screen state.

  onChange?: (state: boolean, handle: FullScreenHandle) => void;
  // Optional callback that gets called when this screen changes state.
  
  className?: string;
  // Optional prop allowing you to apply a custom class name to the FullScreen container
}
```

## CSS

Class `fullscreen-enabled` will be added to component when it goes fullscreen. If you want to alter child elements when this happens you can use a typical CSS statement.

```css
.my-component {
  background: #fff;
}

.fullscreen-enabled .my-component {
  background: #000;
}
```

## In the wild

Used with [MegamanJS](http://megaman.pomle.com/)
