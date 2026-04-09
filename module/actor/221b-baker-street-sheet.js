import { MinuitActorSheet } from "./actor-sheet.js";

export class Minuit221bActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: { template: "systems/minuit/templates/actor/221b-baker-street-sheet.html" }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "description" },
        { id: "vitrine" },
        { id: "historique" },
        { id: "contacts" },
      ],
      initial: "description",
    },
  };

  tabGroups = {
    primary: "description",
  };
}