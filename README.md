# React Full Screen

A React component that sets its children to full screen using the Fullscreen API, normalized using [fscreen](https://github.com/rafrex/fscreen).

## Usage

* Install.
```bash
yarn add react-full-screen
```

* Require component.
```js
import Fullscreen from 'react-full-screen';
```

* Setup and render.
```jsx
import React, { Component } from "react";
import Fullscreen from 'react-full-screen';

class App extends Component {
  constructor(props) {
    this.state = {
      isFullscreenEnabled: false,
    };
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.setState({isFullscreenEnabled: true})}>
          Go Fullscreen
        </button>

        <Fullscreen
          enabled={this.state.isFullscreenEnabled}
          onChange={isFullscreenEnabled => this.setState({isFullscreenEnabled})}
        >
          <div className='full-screenable-node'>
            Hi! This may cover the entire monitor.
          </div>
        </Fullscreen>
      </div>
    );
  }
}

export default App;
```

It is not possible to start in Fullscreen. Fullscreen must be enabled from a user action such as `onClick`.

The reason for keeping track of the current state outside of the component is that the user can choose to leave full screen mode without the action of your application. This is a safety feature of the Fullscreen API.


## In the wild

Used with [MegamanJS](http://megaman.pomle.com/)
