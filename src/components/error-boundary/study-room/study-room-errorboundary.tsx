'use client';

import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface StudyRoomErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

type StudyRoomErrorBoundaryProps = {
  FallbackComponent: ComponentType<StudyRoomErrorFallbackProps>;
  onReset: () => void;
  children: ReactNode;
}

export class StudyRoomErrorBoundary extends Component<StudyRoomErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: StudyRoomErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };

    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('StudyRoom Error:', { error, errorInfo });
  }

  resetErrorBoundary(): void {
    this.props.onReset();
    this.setState({
      hasError: false,
      error: null,
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { FallbackComponent, children } = this.props;

    if (hasError && error) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
} 