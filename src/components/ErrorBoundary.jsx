import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Rendering error caught by ErrorBoundary', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <p>Något gick fel. Testa att gå tillbaka och försök igen.</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Försök igen
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
