"use babel";

import React, { useEffect, useCallback, useRef, useState } from "react";
import _debounce from "lodash/debounce";
import { useModal } from "inkdrop";

import { insertLinkToNote } from "./notes";

const SEARCH_OPTIONS = {
    sort: [{ updatedAt: "desc" }],
};

const SearchDialog = (props) => {
    const { utils } = inkdrop.main.dataStore.getLocalDB();
    const { Dialog } = inkdrop.components.classes;
    const modal = useModal();
    const inputRef = useRef(null);
    const [selectedText, setSelectedText] = useState();
    const [searchTerm, setSearchTerm] = useState();
    const [results, setResults] = useState();
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const subscription = inkdrop.commands.add(document.body, {
            "zettelkasten:toggle-search-dialog": toggle,
        });

        return () => subscription.dispose();
    }, []);

    const searchForTerm = async (term) => {
        setResults();
        setSearching(true);
        const result = await utils.search(term, SEARCH_OPTIONS);
        setSearching(false);

        setResults(result.docs);
    };

    const debouncedSearch = useCallback(_debounce(searchForTerm, 1000), []);

    const updateSearchTerm = (term) => {
        setSearchTerm(term);
        if (!searching && term) {
            debouncedSearch(term);
        }
    };

    const handleInputChange = (event) => {
        updateSearchTerm(event.target.value);
    };

    const toggle = useCallback(({ detail }) => {
        if (detail.text != searchTerm) {
            setSelectedText(detail.text);
            updateSearchTerm(detail.text);
            setResults();
        }
        modal.show();
    }, []);

    const selectNote = async (item) => {
        const noteId = item.currentTarget.getAttribute("data-value");

        await insertLinkToNote(selectedText, noteId);
        modal.close();
    };

    const renderSingleResult = (doc) => {
        return (
            <div className="item note-list-item-view">
                <div
                    className="content"
                    data-value={doc._id}
                    onClick={selectNote}
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

        return results.map(renderSingleResult);
    };

    return (
        <Dialog {...modal.state} onBackdropClick={modal.close}>
            <Dialog.Title>Search Notes</Dialog.Title>
            <Dialog.Content>
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
