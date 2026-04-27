import { MinuitItemSheet } from "./item-sheet.js";

export class MinuitParticulariteItemSheet extends MinuitItemSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/item/particularite-sheet.html",
      scrollable: [".sheet-body"],
    },
  };
}
