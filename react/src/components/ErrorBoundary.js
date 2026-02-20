import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
export default class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "error", style: { margin: "3rem auto", maxWidth: 400, textAlign: "center" }, children: [_jsx("p", { children: "Something went wrong." }), _jsx("button", { className: "btn btn-primary mt-2", onClick: () => this.setState({ hasError: false }), children: "Retry" })] }));
        }
        return this.props.children;
    }
}
