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

  /**
   * Configuration.
   * 
   * @override
   */
  static DEFAULT_OPTIONS = {
    actions: {
      coche: this._onCoche,
    },
  };

  /**
   * Cocher / décocher un item.
   * Dans le HTML : <input type="checkbox" data-action="coche" data-item-id="...">
   */
  static async _onCoche(event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId ?? target.dataset.itemId;
    const item   = foundry.utils.duplicate(
      this.actor.getEmbeddedDocument("Item", itemId)
    );
    item.system.coche = target.checked;
    await this.actor.updateEmbeddedDocuments("Item", [item]);
  }
}