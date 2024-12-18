import React, { useEffect, useState } from "react";
import {
    Form,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "react-bootstrap";
import Button from "../button";
import ConfigService, {
    ConfigBoard,
    ConfigFile
} from "../../services/ConfigService";

type Props = {
    show: boolean;
    defaultFilename: string;
    createNew: boolean;
    onCreate: (filename: string, content?: string) => void;
    onCancel: () => void;
};

const CreateFileModal = ({
    show,
    defaultFilename,
    createNew,
    onCancel,
    onCreate
}: Props) => {
    const [filename, setFileName] = useState(defaultFilename);
    const [boards, setBoards] = useState<ConfigBoard[]>([]);
    const [createFromTemplate, setCreateFromTemplate] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<
        ConfigBoard | undefined
    >();
    const [selectedConfig, setSelectedConfig] = useState<
        ConfigFile | undefined
    >();
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        ConfigService.getBoards().then((boards) => setBoards(boards));
    }, []);

    useEffect(() => {
        setContent("");
        if (!selectedConfig || !selectedConfig.url) {
            return;
        }
        fetch(selectedConfig.url).then((response) => {
            response
                .json()
                .then((data) =>
                    setContent(Buffer.from(data.content, "base64").toString())
                );
        });
    }, [selectedConfig]);

    return (
        <Modal show={show} size="sm" scrollable={true} centered={true}>
            <ModalHeader>Create new config file</ModalHeader>
            <ModalBody>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"text"}
                        placeholder={"Filename"}
                        value={filename}
                        onChange={(event) => setFileName(event.target.value)}
                    />
                </InputGroup>

                {createNew && (
                    <>
                        <InputGroup style={{ marginTop: "20px" }}>
                            <Form.Check
                                type="switch"
                                label="Create from template"
                                onChange={(event) =>
                                    setCreateFromTemplate(event.target.checked)
                                }
                            />
                        </InputGroup>

                        {createFromTemplate && (
                            <>
                                <Form.Label style={{ marginTop: "20px" }}>
                                    Board
                                </Form.Label>
                                <Form.Select
                                    onChange={(event) => {
                                        const newBoard = boards.find(
                                            (board) =>
                                                board.name ===
                                                event.target.value
                                        );
                                        setSelectedBoard(newBoard);

                                        setSelectedConfig(
                                            newBoard?.files?.length
                                                ? newBoard.files?.[0]
                                                : undefined
                                        );
                                    }}
                                >
                                    <option></option>
                                    {boards.map((board, index) => (
                                        <option
                                            key={board.name + index}
                                            value={board.name}
                                        >
                                            {board.name}
                                        </option>
                                    ))}
                                </Form.Select>

                                <Form.Label style={{ marginTop: "20px" }}>
                                    Config template
                                </Form.Label>
                                <Form.Select
                                    onChange={(event) =>
                                        setSelectedConfig(
                                            selectedBoard.files.find(
                                                (file) =>
                                                    file.name ===
                                                    event.target.value
                                            )
                                        )
                                    }
                                    value={selectedConfig?.name}
                                >
                                    {selectedBoard?.files.map((file, index) => (
                                        <option
                                            key={file.name + index}
                                            value={file.name}
                                        >
                                            {file.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </>
                        )}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                    buttonType="btn-success"
                    onClick={() => onCreate(filename, content)}
                >
                    OK
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateFileModal;
