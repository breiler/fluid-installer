import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { GithubRelease, GithubService } from "../../../services";
import { Markdown } from "../../markdown/Markdown";
import Ribbon from "../../ribbon/Ribbon";
import "./LatestVersionCard.scss";

const LatestVersionCard = () => {
    const [latestRelease, setLatestRelease] = useState<GithubRelease>();
    const [releaseDate, setReleaseDate] = useState<string>();
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        GithubService.getReleases().then((releases) => {
            setLatestRelease(releases[0]);

            const date = new Date(releases[0].published_at);
            setReleaseDate(
                date.getFullYear() +
                    "-" +
                    (date.getMonth() + 1) +
                    "-" +
                    date.getDate()
            );
        });
    }, []);

    return (
        <div className="latestVersionCard">
            {latestRelease && (
                <Card bg="light" text="dark">
                    <Card.Body>
                        <Card.Title>{latestRelease.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted light">
                            {releaseDate}
                        </Card.Subtitle>
                        <Card.Text>
                            <span className={showMore ? "" : "shortBody"}>
                                <Markdown>{latestRelease.body}</Markdown>
                            </span>
                            <Button
                                variant="link"
                                onClick={() => setShowMore((value) => !value)}
                            >
                                {showMore ? "Show less" : "Show more"}
                            </Button>
                        </Card.Text>
                    </Card.Body>
                    <Ribbon variant="success">
                        <>LATEST</>
                    </Ribbon>
                </Card>
            )}
        </div>
    );
};

export default LatestVersionCard;
