# Inkdrop plugin: Search Notes

Search notes from within the editor and add link to selected result.

## Commands

### Search notes
#### Add link to selected result (only on editor)
* Search notes from current. Adds a link to selected result
* Also works with selected text
* Mapped to `cmd-shift-s`

#### Navigate to selected result
* Search notes and navigate to selected result.
* Mapped to `alt-cmd-space`

**Note**: I also use these two key bindings to speed up navigation:
* `"alt-cmd-left": "core:navigate-back"`
* `"alt-cmd-right": "core:navigate-forward"`
but [you can set those on your own keymap file](https://docs.inkdrop.app/reference/key-customizations)


### Search notes from editor

**Note**: Inkdrop's search engine tokenizes text, so only full words are supported. See [Inkdrop docs](https://docs.inkdrop.app/manual/searching-notes#caveats-limitations-of-inkdrops-search-engine)


## TO DO
* [x] Search for notes from the editor
    * [x] Command opens modal with input + empty results section
    * [x] Typing in input -> search for notes
    * [x] List notes on result section
    * [x] Select a note -> adds link on current note
    * [ ] Select multiple results to add in current doc
* [ ] ~~Backlinks~~ Part of the core app as of `v5.8.0`
    * [ ] When adding a link to a note, add a backlink on Backlinks section
* [ ] Side pane
    * [ ] Links list
    * [ ] ~~Backlinks list~~ Listed above note as of `v5.8.0`
