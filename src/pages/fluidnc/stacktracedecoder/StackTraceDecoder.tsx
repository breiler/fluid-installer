import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import PageTitle from "../../../components/pagetitle/PageTitle";
import usePageView from "../../../hooks/usePageView";
import useBacktraceLine from "../../../hooks/useBacktraceLine";
import "./StackTraceDecoder.scss";

interface GithubRelease {
    tag_name: string;
    published_at: string;
    name: string;
}

interface DecodedRow {
    index: number;
    address: number;
    function?: string;
    file?: string;
    line?: number;
    offset?: number;
    found: boolean;
}

interface AddrinfoData {
    symbols: Array<[number, string, string, number, number?]>;
    tag?: string;
    mcu?: string;
    build?: string;
}

const StackTraceDecoder = () => {
    usePageView("StackTraceDecoder");

    // Capture backtrace from terminal
    const backtraceContext = useBacktraceLine();

    const [stackTrace, setStackTrace] = useState<string>("");
    const [addrinfo, setAddrinfo] = useState<AddrinfoData | null>(null);
    const [addrinfoSource, setAddrinfoSource] = useState<string>("");
    const [decodedResults, setDecodedResults] = useState<DecodedRow[]>([]);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [statusType, setStatusType] = useState<"info" | "ok" | "error">(
        "info"
    );
    const [_resolvedCount, setResolvedCount] = useState<number>(0);
    const [isUsingCapturedBacktrace, setIsUsingCapturedBacktrace] =
        useState<boolean>(false);

    // Release selection state
    const [releases, setReleases] = useState<GithubRelease[]>([]);
    const [selectedRelease, setSelectedRelease] = useState<string>("");
    const [selectedVariant, setSelectedVariant] =
        useState<string>("esp32-wifi");
    const [isLoadingReleases, setIsLoadingReleases] = useState(false);

    // Ref for scrolling to results
    const resultsRef = useRef<HTMLDivElement>(null);

    // Helper function to show status messages
    const showStatus = (msg: string, kind: "info" | "ok" | "error") => {
        setStatusMessage(msg);
        setStatusType(kind);
    };

    // Load releases on component mount
    useEffect(() => {
        loadReleases();
    }, []);

    // When a new backtrace is captured from terminal, auto-populate it
    useEffect(() => {
        console.log(
            "StackTraceDecoder useEffect: backtraceLine =",
            backtraceContext.backtraceLine
        );
        if (backtraceContext.backtraceLine) {
            setStackTrace((prev) => {
                // Only update if field is empty or if the new backtrace is different
                if (!prev || prev !== backtraceContext.backtraceLine) {
                    console.log(
                        "StackTraceDecoder: Updating stackTrace with captured backtrace"
                    );
                    showStatus("Backtrace captured from terminal!", "ok");
                    setIsUsingCapturedBacktrace(true);
                    return backtraceContext.backtraceLine;
                }
                return prev;
            });
        }
    }, [backtraceContext.backtraceLine]);

    // Auto-select release when detected
    useEffect(() => {
        if (backtraceContext.detectedRelease && releases.length > 0) {
            // Find the release that matches the detected version
            const matchingRelease = releases.find(
                (r) =>
                    r.tag_name === backtraceContext.detectedRelease ||
                    r.name?.includes(backtraceContext.detectedRelease)
            );
            if (matchingRelease) {
                console.log(
                    "StackTraceDecoder: Auto-selecting release:",
                    matchingRelease.tag_name
                );
                setSelectedRelease(matchingRelease.tag_name);
            }
        }
    }, [backtraceContext.detectedRelease, releases]);

    // Auto-select variant when detected
    useEffect(() => {
        if (backtraceContext.detectedVariant) {
            console.log(
                "StackTraceDecoder: Auto-selecting variant:",
                backtraceContext.detectedVariant
            );
            setSelectedVariant(backtraceContext.detectedVariant);
        }
    }, [backtraceContext.detectedVariant]);

    // Fetch releases from GitHub
    const loadReleases = async () => {
        setIsLoadingReleases(true);
        try {
            const resp = await fetch(
                "https://api.github.com/repos/bdring/FluidNC/releases?per_page=30"
            );
            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}`);
            }
            const data = (await resp.json()) as GithubRelease[];
            setReleases(data);
        } catch (e) {
            showStatus(
                `Failed to load releases: ${e instanceof Error ? e.message : String(e)}`,
                "error"
            );
        } finally {
            setIsLoadingReleases(false);
        }
    };

    // Variant configuration
    const variantInfo = (variant: string) => {
        const [mcu, build] = variant.split("-");
        return { mcu, build };
    };

    // Load addrinfo from GitHub release
    const loadFromRelease = async () => {
        if (!selectedRelease) {
            showStatus("Please select a FluidNC release.", "error");
            return;
        }

        const vi = variantInfo(selectedVariant);
        const url = `https://raw.githubusercontent.com/bdring/fluidnc-releases/main/releases/${selectedRelease}/${vi.mcu}/${vi.build}/firmware.addrinfo`;

        showStatus(
            `Downloading firmware.addrinfo for ${selectedRelease} / ${selectedVariant}…`,
            "info"
        );

        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error(
                    `HTTP ${resp.status} — the .addrinfo file may not exist for this release/variant.`
                );
            }
            const data = (await resp.json()) as AddrinfoData;
            if (!data.symbols || !Array.isArray(data.symbols)) {
                throw new Error("Invalid .addrinfo file (no symbols array).");
            }
            setAddrinfo(data);
            setAddrinfoSource(`${selectedRelease} / ${selectedVariant}`);
            showStatus(
                `Loaded ${data.symbols.length.toLocaleString()} symbols from ${selectedRelease} / ${selectedVariant}.`,
                "ok"
            );
        } catch (e) {
            showStatus(
                `Failed to load symbol data: ${e instanceof Error ? e.message : String(e)}`,
                "error"
            );
            setAddrinfo(null);
        }
    };

    // Extract addresses from backtrace text
    const extractAddresses = (text: string): number[] => {
        const results: number[] = [];
        const seen = new Set<number>();

        // Try Backtrace format: 0xADDR:0xSP 0xADDR:0xSP ...
        const btMatch = text.match(
            /Backtrace:\s*((?:0x[0-9a-fA-F]+:0x[0-9a-fA-F]+\s*)+)/i
        );
        if (btMatch) {
            const pairs = btMatch[1].matchAll(
                /0x([0-9a-fA-F]{8}):0x[0-9a-fA-F]{8}/g
            );
            for (const m of pairs) {
                const addr = parseInt(m[1], 16);
                if (!seen.has(addr)) {
                    seen.add(addr);
                    results.push(addr);
                }
            }
        }

        // Look for "PC: 0x..." or "EXCVADDR: 0x..."
        const pcMatch = text.matchAll(/\bPC\s*[:=]\s*0x([0-9a-fA-F]{8})/gi);
        for (const m of pcMatch) {
            const addr = parseInt(m[1], 16);
            if (!seen.has(addr)) {
                seen.add(addr);
                results.push(addr);
            }
        }

        // Fallback: any 0x-prefixed 8-digit hex that looks like a code address (0x4xxxxxxx)
        if (results.length === 0) {
            const all = text.matchAll(/0x(4[0-9a-fA-F]{7})/g);
            for (const m of all) {
                const addr = parseInt(m[1], 16);
                if (!seen.has(addr)) {
                    seen.add(addr);
                    results.push(addr);
                }
            }
        }

        return results;
    };

    // Binary search to find symbol matching an address
    const lookupAddress = (
        symbols: Array<[number, string, string, number, number?]>,
        addr: number
    ) => {
        let lo = 0,
            hi = symbols.length - 1;
        let best: number | null = null;
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            const symAddr = symbols[mid][0];
            if (symAddr <= addr) {
                best = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        if (best === null) return null;

        const sym = symbols[best];
        const offset = addr - sym[0];

        // If we have a size field and the address is beyond the function, not a match
        if (sym.length > 4 && sym[4] > 0 && offset >= sym[4]) {
            return null;
        }

        // Sanity: don't return matches with very large offsets (> 64KB) without explicit size
        if (sym.length <= 4 && offset > 0x10000) {
            return null;
        }

        return {
            address: sym[0],
            name: sym[1],
            file: sym[2],
            line: sym[3],
            size: sym.length > 4 ? sym[4] : null,
            offset: offset
        };
    };

    const handleDecodeTrace = () => {
        const text = stackTrace.trim();
        if (!text) {
            showStatus("Please paste a stack trace.", "error");
            return;
        }

        if (!addrinfo) {
            showStatus("Please load an .addrinfo file first.", "error");
            return;
        }

        const addresses = extractAddresses(text);
        if (addresses.length === 0) {
            showStatus("No valid code addresses found in the input.", "error");
            return;
        }

        const symbols = addrinfo.symbols;
        const rows: DecodedRow[] = [];
        let resolved = 0;

        for (const addr of addresses) {
            const sym = lookupAddress(symbols, addr);
            if (sym) {
                resolved++;
                rows.push({
                    index: rows.length,
                    address: addr,
                    function: sym.name,
                    file: sym.file,
                    line: sym.line,
                    offset: sym.offset,
                    found: true
                });
            } else {
                rows.push({
                    index: rows.length,
                    address: addr,
                    found: false
                });
            }
        }

        setDecodedResults(rows);
        setResolvedCount(resolved);
        showStatus(
            `Decoded ${resolved}/${addresses.length} addresses using ${addrinfoSource}.`,
            resolved > 0 ? "ok" : "info"
        );

        // Scroll to results after a short delay to ensure rendering
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        showStatus(`Loading ${file.name}…`, "info");
        try {
            const text = await file.text();
            const data = JSON.parse(text) as AddrinfoData;
            if (!data.symbols || !Array.isArray(data.symbols)) {
                throw new Error("Invalid .addrinfo file (no symbols array).");
            }
            setAddrinfo(data);
            setAddrinfoSource(file.name);
            showStatus(
                `Loaded ${data.symbols.length.toLocaleString()} symbols from ${file.name}.`,
                "ok"
            );
        } catch (e) {
            showStatus(
                `Failed to load file: ${e instanceof Error ? e.message : String(e)}`,
                "error"
            );
            setAddrinfo(null);
        }
    };

    const handleClearAll = () => {
        setStackTrace("");
        setDecodedResults([]);
        setStatusMessage("");
        setIsUsingCapturedBacktrace(false);
    };

    const formatAddress = (addr: number): string => {
        return `0x${addr.toString(16).padStart(8, "0")}`;
    };

    const getAddrinfoMeta = (): string => {
        if (!addrinfo) return "";
        const parts: string[] = [];
        if (addrinfo.tag) parts.push(`tag: ${addrinfo.tag}`);
        if (addrinfo.mcu) parts.push(`mcu: ${addrinfo.mcu}`);
        if (addrinfo.build) parts.push(`build: ${addrinfo.build}`);
        parts.push(`${addrinfo.symbols.length.toLocaleString()} symbols`);
        return parts.join(" · ");
    };

    return (
        <>
            <PageTitle>Stack Trace Decoder</PageTitle>
            <p>Decode ESP32 stack backtraces using .addrinfo symbol files.</p>

            <Row className="mb-4">
                <Col xs={12} md={6}>
                    <div className="decoder-section">
                        <h5>Stack Trace</h5>
                        <label
                            htmlFor="stackTrace"
                            className="form-label"
                            style={{
                                opacity: backtraceContext.backtraceLine
                                    ? 0.5
                                    : 1,
                                transition: "opacity 0.2s"
                            }}
                        >
                            Paste your ESP32 backtrace or crash dump:
                        </label>
                        <textarea
                            id="stackTrace"
                            className="form-control decoder-textarea"
                            value={stackTrace}
                            onChange={(e) => setStackTrace(e.target.value)}
                            placeholder="Backtrace: 0x400936f6:0x3ffb1a30 0x4009200a:0x3ffb1a50 0x40090bc0:0x3ffb1a70 ...

Or paste a full crash dump — addresses will be extracted automatically."
                            style={{
                                color: stackTrace ? "#000000" : "inherit",
                                fontWeight: stackTrace ? 700 : 400,
                                minHeight: "320px",
                                resize: "vertical"
                            }}
                        />
                        {backtraceContext.backtraceLine && (
                            <div className="d-grid gap-2 mt-2">
                                <button
                                    className={`btn ${isUsingCapturedBacktrace ? "btn-success" : "btn-outline-success"}`}
                                    onClick={() => {
                                        setStackTrace(
                                            backtraceContext.backtraceLine
                                        );
                                        setIsUsingCapturedBacktrace(true);
                                    }}
                                    title="Populate the text area with the last backtrace captured from the terminal"
                                >
                                    {isUsingCapturedBacktrace
                                        ? "✓ Using Captured Backtrace"
                                        : "Use Captured Backtrace"}
                                </button>
                            </div>
                        )}
                        <div className="d-grid gap-2 mt-3">
                            <button
                                className="btn btn-secondary"
                                onClick={handleClearAll}
                            >
                                Clear
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleDecodeTrace}
                                disabled={!addrinfo}
                            >
                                Decode Stack Trace
                            </button>
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={6}>
                    <Row className="g-2">
                        <Col xs={12}>
                            <div className="decoder-section">
                                <h5>FluidNC Release</h5>
                                <label
                                    htmlFor="releaseSelect"
                                    className="form-label"
                                >
                                    Release version:
                                </label>
                                <select
                                    id="releaseSelect"
                                    className="form-select"
                                    value={selectedRelease}
                                    onChange={(e) =>
                                        setSelectedRelease(e.target.value)
                                    }
                                    disabled={isLoadingReleases}
                                >
                                    <option value="">
                                        {isLoadingReleases
                                            ? "Loading releases…"
                                            : "— select release —"}
                                    </option>
                                    {releases.map((r) => (
                                        <option
                                            key={r.tag_name}
                                            value={r.tag_name}
                                        >
                                            {r.tag_name} (
                                            {r.published_at?.split("T")[0] ||
                                                "draft"}
                                            )
                                        </option>
                                    ))}
                                </select>

                                <div style={{ marginTop: "10px" }}>
                                    <label
                                        htmlFor="variantSelect"
                                        className="form-label"
                                    >
                                        Firmware variant:
                                    </label>
                                    <select
                                        id="variantSelect"
                                        className="form-select"
                                        value={selectedVariant}
                                        onChange={(e) =>
                                            setSelectedVariant(e.target.value)
                                        }
                                    >
                                        <option value="esp32-wifi">
                                            WiFi (esp32)
                                        </option>
                                        <option value="esp32-bt">
                                            Bluetooth (esp32)
                                        </option>
                                        <option value="esp32-noradio">
                                            No-radio (esp32)
                                        </option>
                                        <option value="esp32s3-wifi">
                                            WiFi (esp32-s3)
                                        </option>
                                        <option value="esp32s3-noradio">
                                            No-radio (esp32-s3)
                                        </option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-outline-primary w-100 mt-3"
                                    onClick={loadFromRelease}
                                    disabled={!selectedRelease}
                                >
                                    Load from Release
                                </button>
                            </div>
                        </Col>

                        <Col xs={12}>
                            <div className="decoder-section">
                                <h5>Local .addrinfo File</h5>
                                <p style={{ fontSize: "13px", marginTop: "0" }}>
                                    Alternatively, load a <code>.addrinfo</code>{" "}
                                    file generated by{" "}
                                    <code>generate_addrinfo.py</code>.
                                </p>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        accept=".addrinfo,.json"
                                        onChange={handleFileUpload}
                                        className="form-control"
                                    />
                                </div>
                                {addrinfoSource && (
                                    <div className="addrinfo-meta">
                                        {getAddrinfoMeta()}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {statusMessage && (
                <div
                    className={`alert alert-${statusType === "error" ? "danger" : statusType === "ok" ? "success" : "info"} mb-4`}
                >
                    {statusType === "error" && "❌ "}
                    {statusType === "ok" && "✅ "}
                    {statusType === "info" && "⏳ "}
                    {statusMessage}
                </div>
            )}

            {decodedResults.length > 0 && (
                <div className="decoder-results" ref={resultsRef}>
                    <div className="result-table-wrapper">
                        <table className="table table-sm table-hover result-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Address</th>
                                    <th>Function</th>
                                    <th>Source Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decodedResults.map((row) => (
                                    <tr key={row.index}>
                                        <td>{row.index}</td>
                                        <td className="addr">
                                            {formatAddress(row.address)}
                                        </td>
                                        {row.found ? (
                                            <>
                                                <td className="func">
                                                    {row.function}{" "}
                                                    <span className="offset">
                                                        +0x
                                                        {row.offset?.toString(
                                                            16
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="file">
                                                    {row.file !== "??" ? (
                                                        `${row.file}:${row.line}`
                                                    ) : (
                                                        <span className="unknown">
                                                            unknown source
                                                        </span>
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <td className="unknown" colSpan={2}>
                                                not found in symbol table
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="raw-output">
                        <strong>Plain Text Output:</strong>
                        <pre>
                            {decodedResults
                                .map((r, i) => {
                                    if (r.found) {
                                        const loc =
                                            r.file !== "??"
                                                ? `${r.file}:${r.line}`
                                                : "(unknown source)";
                                        return `#${i}  ${formatAddress(r.address)}  ${r.function}+0x${r.offset?.toString(16)}  at ${loc}`;
                                    }
                                    return `#${i}  ${formatAddress(r.address)}  ??`;
                                })
                                .join("\n")}
                        </pre>
                    </div>
                </div>
            )}

            <div className="info-box mt-4">
                <h6>ℹ️ How it works</h6>
                <ol>
                    <li>
                        Load a <code>.addrinfo</code> file generated by{" "}
                        <code>generate_addrinfo.py</code>.
                    </li>
                    <li>
                        Paste the <code>Backtrace:</code> line (or full crash
                        dump) from your ESP32 serial output.
                    </li>
                    <li>
                        Click <strong>Decode</strong>. All processing happens in
                        your browser — nothing is uploaded anywhere.
                    </li>
                </ol>
                <p className="mb-0">
                    <strong>About .addrinfo files:</strong> During the FluidNC
                    release build,
                    <code>generate_addrinfo.py</code> runs the toolchain&apos;s{" "}
                    <code>nm</code> and <code>addr2line</code> against each
                    firmware ELF to produce a compact JSON mapping of every code
                    symbol to its source file and line number. The{" "}
                    <code>.addrinfo</code> file is published as a release asset
                    alongside the firmware binaries.
                </p>
            </div>
        </>
    );
};

export default StackTraceDecoder;
