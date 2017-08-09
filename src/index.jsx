import React, { Component } from "react";
import PropTypes from "prop-types";
import fscreen from "fscreen";

class FullScreen extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    enabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    enabled: false,
  };

  constructor(props) {
    super(props);

    this.detectFullScreen = this.detectFullScreen.bind(this);
    this.enterFullScreen = this.enterFullScreen.bind(this);
    this.leaveFullScreen = this.leaveFullScreen.bind(this);
  }

  componentDidMount() {
    fscreen.addEventListener("fullscreenchange", this.detectFullScreen);
  }

  componentWillUnmount() {
    fscreen.removeEventListener("fullscreenchange", this.detectFullScreen);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleProps(props) {
    const enabled = fscreen.fullscreenElement;
    if (enabled && !props.enabled) {
      this.leaveFullScreen();
    } else if (!enabled && props.enabled) {
      this.enterFullScreen();
    }
  }

  detectFullScreen() {
    if (this.props.onChange) {
      this.props.onChange(!!fscreen.fullscreenElement);
    }
  }

  enterFullScreen() {
    fscreen.requestFullscreen(this.node);
  }

  leaveFullScreen() {
    fscreen.exitFullscreen();
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
