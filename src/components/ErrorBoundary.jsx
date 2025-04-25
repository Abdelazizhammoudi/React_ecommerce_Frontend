import React from "react";
import { withTranslation } from 'react-i18next';
import "@/styles/global.css";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="error">
          {t('error.boundary.message')}
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);