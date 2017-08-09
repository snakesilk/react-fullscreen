import React, { Component } from "react";
import PropTypes from "prop-types";

function isFullScreen() {
  return (
    document.isFullscreen ||
    document.webkitIsFullScreen ||
    document.mozIsFullScreen
  );
}

class FullScreen extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    enabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func
  };

  static defaultProps = {
    enabled: false
  };

  constructor(props) {
    super(props);

    this.detectFullScreen = this.detectFullScreen.bind(this);
    this.enterFullScreen = this.enterFullScreen.bind(this);
    this.leaveFullScreen = this.leaveFullScreen.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mozfullscreenchange", this.detectFullScreen);
    document.addEventListener("webkitfullscreenchange", this.detectFullScreen);
    document.addEventListener("fullscreenchange", this.detectFullScreen);
  }

  componentWillUnmount() {
    document.removeEventListener("mozfullscreenchange", this.detectFullScreen);
    document.removeEventListener(
      "webkitfullscreenchange",
      this.detectFullScreen
    );
    document.removeEventListener("fullscreenchange", this.detectFullScreen);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleProps(props) {
    const enabled = isFullScreen();
    if (enabled && !props.enabled) {
      this.leaveFullScreen();
    } else if (!enabled && props.enabled) {
      this.enterFullScreen();
    }
  }

  detectFullScreen() {
    if (this.props.onChange) {
      this.props.onChange(isFullScreen());
    }
  }

  enterFullScreen() {
    const n = this.node;
    (n.requestFullScreen || n.webkitRequestFullScreen || n.mozRequestFullScreen)
      .call(n);
  }

  leaveFullScreen() {
    const d = document;
    (d.exitFullScreen || d.webkitExitFullscreen || d.mozExitFullScreen).call(d);
  }

  render() {
    return (
      <div
        className="FullScreen"
        ref={node => (this.node = node)}
        style={{ height: "100%", width: "100%" }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default FullScreen;
