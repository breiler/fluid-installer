import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    children: string;
};
export const Markdown = ({ children }: Props) => {
    return (
        <ErrorBoundary
            fallback={
                <pre className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {children}
                </pre>
            }
            resetKeys={[children]}
        >
            <ReactMarkdown className="card-text" remarkPlugins={[remarkGfm]}>
                {children}
            </ReactMarkdown>
        </ErrorBoundary>
    );
};
