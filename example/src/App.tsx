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

  const handleEnterWithErrorLogging = useCallback(() => {
    return screen2.enter().catch(console.error);
  }, [screen2]);

  return (
    <div>
      <button onClick={screen1.enter}>
        First
      </button>

      <button onClick={handleEnterWithErrorLogging}>
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
