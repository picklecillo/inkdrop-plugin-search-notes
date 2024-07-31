"use babel";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { useModal } from "inkdrop";

import { insertLinkToNote, navigateToNote } from "./notes";

const SEARCH_OPTIONS = {
    sort: [{ updatedAt: "desc" }],
};

const editingNoteSelector = ({ editingNote }) => editingNote;

const SearchDialog = (props) => {
    const { utils } = inkdrop.main.dataStore.getLocalDB();
    const editingNote = useSelector(editingNoteSelector);
    const { Dialog } = inkdrop.components.classes;
    const modal = useModal();
    const inputRef = useRef(null);
    const [navigate, setNavigate] = useState(false);
    const [selectedText, setSelectedText] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const [results, setResults] = useState();
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const subscription = inkdrop.commands.add(document.body, {
            "search-notes:toggle-search-dialog": toggle,
        });


        const keyBindings = inkdrop.keymaps.findKeyBindings({
            command: 'search-notes:search',
        });

        return () => {
            subscription.dispose();
        };
    }, []);

    useEffect(() => {
        if (modal.state.visible) {
            focusOnInput();
        }
    }, [modal.state.visible])

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

    const updateSearchTerm = (term) => {
        setSearchTerm(term);
        setResults();

        if (!searching && term) {
            return debouncedSearch(term);
        }
    };

    const handleInputChange = (event) => {
        updateSearchTerm(event.target.value);
    };

    const focusOnInput = () => {
        inputRef.current.focus();
    }

    const toggle = useCallback(({ detail }) => {
        if (detail.text != searchTerm) {
            setSelectedText(detail.text);
            updateSearchTerm(detail.text);
        }
        setNavigate(detail?.navigate ?? false);
        modal.show();
    }, [searchTerm]);

    const handleNoteSelection = async (item) => {
        const noteId = item.currentTarget.getAttribute("data-value");

        if (navigate) {
            await navigateToNote(noteId);
        } else {
            await insertLinkToNote(selectedText, noteId);
        }

        modal.close();
    };

    const renderResultItem = (doc) => {
        return (
            <div className="item note-list-item-view">
                <div
                    className="content"
                    data-value={doc._id}
                    onClick={handleNoteSelection}
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
            </div>
        );
    };

    const renderResultDocs = () => {
        if (!results) {
            return <div>...</div>;
        }

        if (!results.length) {
            return <div>No results</div>;
        }

        return results.map(renderResultItem);
    };

    return (
        <Dialog
            {...modal.state}
            large
            onBackdropClick={modal.close}
            onEscKeyDown={modal.close}
        >
            <Dialog.Title>Search Notes</Dialog.Title>
            <Dialog.Content className="flex">
                <div className="notebook-list-bar">
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
                        className="list-bar ui middle aligned selection list "
                        tabindex="0"
                        style={{overflow: 'auto'}}
                    >
                        {renderResultDocs()}
                    </div>
                </div>
            </Dialog.Content>
            <Dialog.Actions>
                <button className="ui button" onClick={modal.close}>
                    Close
                </button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default SearchDialog;
