import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Markdown.scss";

type Props = {
    children: string;
};
export const Markdown = ({ children }: Props) => {
    // Guard against undefined or null children
    if (!children) {
        return null;
    }

    return (
        <ErrorBoundary
            fallback={
                <pre className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {children}
                </pre>
            }
            resetKeys={[children]}
            onError={() => {}}
        >
            <ReactMarkdown
                className="markdown card-text"
                remarkPlugins={[remarkGfm]}
            >
                {children}
            </ReactMarkdown>
        </ErrorBoundary>
    );
};
