function markdownLink(text, noteId) {
    return `[${text}](inkdrop://${noteId})`;
}

async function insertLinkToNote(selectedText, noteId) {
    const editor = inkdrop.getActiveEditor().cm;
    const { notes } = inkdrop.main.dataStore.getLocalDB();

    const note = await notes.get(noteId);

    var text = selectedText.text
        ? selectedText
        : note.title.length
        ? note.title
        : "Link";
    if (selectedText.length && note.title.length) {
        text = `${selectedText} (${note.title})`;
    }

    editor.doc.replaceSelection(markdownLink(text, noteId));
}

module.exports = {
    insertLinkToNote,
};
