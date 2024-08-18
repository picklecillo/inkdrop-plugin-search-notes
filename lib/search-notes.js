"use babel";

import SearchDialog from "./search-dialog";
import NavigationDialog from "./navigation-dialog";

let commandListener = null;

function baseCommand(commandName) {
    var editor = global.inkdrop.getActiveEditor().cm;

    const selectedText = editor.doc.getSelection();

    inkdrop.commands.dispatch(document.body, commandName, {
        text: selectedText,
    });
}

function insertLink() {
    return baseCommand("search-notes:toggle-search-dialog");
}

function navigateToNote() {
    return baseCommand("search-notes:toggle-navigation-dialog");
}

module.exports = {
    activate() {
        inkdrop.components.registerClass(SearchDialog);
        inkdrop.layouts.addComponentToLayout("modal", "SearchDialog");

        inkdrop.components.registerClass(NavigationDialog);
        inkdrop.layouts.addComponentToLayout("modal", "NavigationDialog");

        commandListener = inkdrop.commands.add(document.body, {
            "search-notes:insert-link": insertLink,
            "search-notes:navigate": navigateToNote,
        });
    },
    deactivate() {
        inkdrop.layouts.removeComponentFromLayout("modal", "SearchDialog");
        inkdrop.layouts.removeComponentFromLayout("modal", "NavigationDialog");
        inkdrop.components.deleteClass(SearchDialog);
        inkdrop.components.deleteClass(NavigationDialog);

        commandListener.dispose();
    },
};
