"use babel";

import React from "react";

import { insertLinkToNote } from "./notes";
import BaseDialog from "./base-dialog";

const SearchDialog = () => {
  return (
    <BaseDialog
      listItemType="insert-search-result"
      commandName="search-notes:toggle-search-dialog"
      actionHandler={insertLinkToNote}
    />
  );
};

export default SearchDialog;
