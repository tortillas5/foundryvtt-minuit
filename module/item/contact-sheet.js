import { MinuitItemSheet } from "./item-sheet.js";

export class MinuitContactItemSheet extends MinuitItemSheet {
  static PARTS = {
    sheet: { template: "systems/minuit/templates/item/contact-sheet.html" }
  };
}