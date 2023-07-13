import React from "react"
import { ErrorBoundary } from "react-error-boundary";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const Markdown = ({ children }) => {

    return <ErrorBoundary fallback={<pre className="card-text" style={{ whiteSpace: "pre-wrap" }}>{children}</pre>} resetKeys={[children]}><ReactMarkdown
        children={children}
        className="card-text"
        remarkPlugins={[remarkGfm]}
    /></ErrorBoundary>;

}
