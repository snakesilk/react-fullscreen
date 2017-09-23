import { Component, CSSProperties, ReactNode } from "react"

interface FullscreenProps {
  enabled: boolean
  onChange?: (enabled: boolean) => any
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

declare class FullScreen extends Component<FullscreenProps> {}

export default FullScreen
