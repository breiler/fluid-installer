import React, { useEffect, useState } from "react";
import { Card, Placeholder } from "react-bootstrap";
import { GithubRelease } from "../../../services";
import Ribbon from "../../ribbon/Ribbon";
import ShowMore from "../../showmore/ShowMore";
import { Markdown } from "../../markdown/Markdown";

type Props = {
    release: GithubRelease;
    isLatest: boolean;
};
const VersionCard = ({ release, isLatest }: Props) => {
    const [releaseDate, setReleaseDate] = useState<string>();

    useEffect(() => {
        setReleaseDate("");
        if (release) {
            const date = new Date(release.published_at);
            setReleaseDate(date.toISOString().slice(0, 10));
        }
    }, [release]);
    return (
        <Card bg="light" text="dark">
            <Card.Body>
                {!release && (
                    <>
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Subtitle} animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                    </>
                )}
                {release && isLatest && (
                    <>
                        <Card.Title>{release?.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted light">
                            {releaseDate ?? (
                                <Placeholder xs={5} animation="glow" />
                            )}
                        </Card.Subtitle>
                    </>
                )}

                {release && (
                    <ShowMore maxHeight={250}>
                        <Markdown>
                            {release.body || "No release notes available."}
                        </Markdown>
                    </ShowMore>
                )}
            </Card.Body>
            <Ribbon variant="success">
                {isLatest && <>LATEST</>}
                {!isLatest && <>{release.name}</>}
            </Ribbon>
        </Card>
    );
};

export default VersionCard;
