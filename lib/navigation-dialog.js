"use babel";

import React from "react";

import { navigateToNote } from "./notes";
import BaseDialog from "./base-dialog";

const NavigationDialog = () => {
  return (
    <BaseDialog
      listItemType="navigation-search-result"
      commandName="search-notes:toggle-navigation-dialog"
      actionHandler={navigateToNote}
    />
  );
};

export default NavigationDialog;
