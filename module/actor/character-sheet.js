import { MinuitActorSheet } from "./actor-sheet.js";

export class MinuitCharacterActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: { template: "systems/minuit/templates/actor/character-sheet.html" }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "description" },
        { id: "expertises" },
        { id: "particularite" },
        { id: "equipement" },
      ],
      initial: "description",
    },
  };

  tabGroups = {
    primary: "description",
  };
}
