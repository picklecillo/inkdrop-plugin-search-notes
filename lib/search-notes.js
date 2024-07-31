"use babel";

import SearchDialog from "./search-dialog";

let commandListener = null;

function embedLink() {
    var editor = global.inkdrop.getActiveEditor().cm;

    const selectedText = editor.doc.getSelection();

    inkdrop.commands.dispatch(
        document.body,
        "search-notes:toggle-search-dialog",
        { text: selectedText },
    );
}

function navigate() {
    inkdrop.commands.dispatch(
        document.body,
        "search-notes:toggle-search-dialog",
        { text: null, navigate: true },
    );
}

module.exports = {
    activate() {
        inkdrop.components.registerClass(SearchDialog);
        inkdrop.layouts.addComponentToLayout("modal", "SearchDialog");

        commandListener = inkdrop.commands.add(document.body, {
            "search-notes:search": embedLink,
            "search-notes:navigate": navigate,
        });
    },
    deactivate() {
        inkdrop.layouts.removeComponentFromLayout("modal", "SearchDialog");
        inkdrop.components.deleteClass(SearchDialog);

        commandListener.dispose();
    },
};
