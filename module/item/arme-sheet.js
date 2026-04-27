import { MinuitItemSheet } from "./item-sheet.js";

export class MinuitArmeItemSheet extends MinuitItemSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/item/arme-sheet.html",
      scrollable: [".sheet-body"],
    },
  };
}
