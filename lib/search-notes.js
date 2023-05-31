"use babel";

import SearchDialog from "./search-dialog";

let commandListener = null;

function search() {
    var editor = global.inkdrop.getActiveEditor().cm;

    const selectedText = editor.doc.getSelection();

    inkdrop.commands.dispatch(
        document.body,
        "search-notes:toggle-search-dialog",
        { text: selectedText },
    );
}

module.exports = {
    activate() {
        inkdrop.components.registerClass(SearchDialog);
        inkdrop.layouts.addComponentToLayout("modal", "SearchDialog");

        commandListener = inkdrop.commands.add(document.body, {
            "search-notes:search": search,
        });
    },
    deactivate() {
        inkdrop.layouts.removeComponentFromLayout("modal", "SearchDialog");
        inkdrop.components.deleteClass(SearchDialog);

        commandListener.dispose();
    },
};
