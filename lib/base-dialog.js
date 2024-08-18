"use babel";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { useModal } from "inkdrop";

import { navigateToNote } from "./notes";

const SEARCH_OPTIONS = {
    sort: [{ updatedAt: "desc" }],
};

const editingNoteSelector = ({ editingNote }) => editingNote;

const BaseDialog = ({ listItemType, commandName, actionHandler }) => {
    const { utils } = inkdrop.main.dataStore.getLocalDB();
    const editingNote = useSelector(editingNoteSelector);
    const { Dialog } = inkdrop.components.classes;
    const modal = useModal();
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState();
    const [selectedText, setSelectedText] = useState();
    const [results, setResults] = useState();
    const [searching, setSearching] = useState(false);

    const searchForTerm = async (term) => {
        setResults();
        setSearching(true);
        const result = await utils.search(term, SEARCH_OPTIONS);
        setSearching(false);

        const filteredDocs = result.docs.filter(
            (item) => item._id !== editingNote?._id,
        );

        setResults(filteredDocs);
    };

    const debouncedSearch = useCallback(_debounce(searchForTerm, 1000), [
        editingNote?._id,
    ]);

    const handleInputChange = (event) => {
        updateSearchTerm(event.target.value);
    };

    const focusOnInput = () => {
        inputRef.current.focus();
    };

    const closeSearchDialog = () => {
        setSearchTerm();
        setResults();
        modal.close();
    };

    const updateSearchTerm = (term) => {
        setSearchTerm(term);
        setResults();

        if (!searching && term) {
            return debouncedSearch(term);
        }
    };

    const toggle = useCallback(
        ({ detail }) => {
            if (detail?.text) {
                setSelectedText(detail.text);
                updateSearchTerm(detail.text);
            }
            modal.show();
        },
        [updateSearchTerm],
    );

    const handleNoteSelection = useCallback(
        async (noteId) => {
            await actionHandler({ noteId, selectedText });
            closeSearchDialog();
        },
        [actionHandler, closeSearchDialog],
    );

    useEffect(() => {
        const subscription = inkdrop.commands.add(document.body, {
            [commandName]: toggle,
        });

        const bindingMatchSubscription = inkdrop.keymaps.onDidMatchBinding(
            ({ keystrokes, keyboardEventTarget }) => {
                if (
                    keystrokes === "enter" &&
                    keyboardEventTarget.type === listItemType
                ) {
                    handleNoteSelection(keyboardEventTarget.id);
                }
            },
        );

        return () => {
            subscription.dispose();
            bindingMatchSubscription.dispose();
        };
    }, [listItemType, toggle, handleNoteSelection]);

    useEffect(() => {
        if (modal.state.visible) {
            focusOnInput();
        }
    }, [modal.state.visible]);

    const renderResultItem = (doc, index) => {
        return (
            <li
                key={doc._id}
                id={doc._id}
                tabindex="0"
                className={`item note-list-item-view`}
                style={{ padding: 0 }}
                type={listItemType}
            >
                <div
                    className="content"
                    data-value={doc._id}
                    onClick={(event) => {
                        const noteId =
                            event.currentTarget.getAttribute("data-value");
                        handleNoteSelection(noteId);
                    }}
                >
                    <div className="header">
                        {doc.title ? doc.title : "(No title)"}
                    </div>
                    <div className="description">
                        <span className="text">
                            {doc.body ? doc.body.substr(0, 80) : "(No body)"}
                        </span>
                    </div>
                </div>
            </li>
        );
    };

    const renderResultDocs = () => {
        if (!results) {
            return <div>...</div>;
        }

        if (!results.length) {
            return <div>No results</div>;
        }

        return (
            <menu style={{ listStyleType: "none", padding: 0 }}>
                {results.map((item, index) => renderResultItem(item, index))}
            </menu>
        );
    };

    return (
        <Dialog
            {...modal.state}
            large
            onBackdropClick={closeSearchDialog}
            onEscKeyDown={closeSearchDialog}
        >
            <Dialog.Title>Search Notes</Dialog.Title>
            <Dialog.Content className="flex">
                <div className="notebook-list-bar search-notes-dialog-contents">
                    <div className="ui fluid left icon input">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            ref={inputRef}
                        />
                        <i className="search icon"></i>
                    </div>
                    <div
                        className="list-bar ui middle aligned selection list search-notes-result-list"
                        tabindex="-1"
                        style={{ overflow: "auto" }}
                    >
                        {renderResultDocs()}
                    </div>
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <button className="ui button" onClick={closeSearchDialog}>
                    Close
                </button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default BaseDialog;
