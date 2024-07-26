function markdownLink(title, noteId) {
    var linkText = `[](inkdrop://${noteId})`;

    if (title) {
        return `${linkText} <!-- ${title} -->`;
    }

    return linkText;
}

function textInsert(selectedText, noteTitle, noteId) {
    const linkText = markdownLink(noteTitle, noteId);

    if (selectedText.length) {
        return `${selectedText} (${linkText})`;
    }

    return ` ${linkText} `;
}

async function insertLinkToNote(selectedText, noteId) {
    const editor = inkdrop.getActiveEditor().cm;
    const { notes } = inkdrop.main.dataStore.getLocalDB();

    const note = await notes.get(noteId);

    editor.doc.replaceSelection(textInsert(selectedText, note.title, noteId));
}

module.exports = {
    insertLinkToNote,
};
