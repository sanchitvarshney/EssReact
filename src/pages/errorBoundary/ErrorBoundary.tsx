import { Component } from "react";
import FallBackUi from "./FallBackUi";


class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(__: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);
  }

  render() {
    //@ts-ignore
    if (this.state.hasError) {
      return <FallBackUi />;
    }
    //@ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
