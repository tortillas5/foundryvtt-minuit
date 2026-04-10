import { MinuitActorSheet } from "./actor-sheet.js";

export class MinuitDirectriceActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: { template: "systems/minuit/templates/actor/directrice-sheet.html" }
  };

  /**
   * Configuration.
   * 
   * @override
   */
  static DEFAULT_OPTIONS = {
    actions: {
      tensionPlus: MinuitDirectriceActorSheet._onTensionPlus,
      tensionMinus: MinuitDirectriceActorSheet._onTensionMinus,
    },
  };

    /**
   * Incrémenter la tension.
   */
  static async _onTensionPlus(event, target) {
    event.preventDefault();
    const tension = this.actor.system.tension + 1;
    await this.actor.update({ "system.tension": tension });
  }

  /**
   * Décrémenter la tension.
   */
  static async _onTensionMinus(event, target) {
    event.preventDefault();
    const tension = this.actor.system.tension - 1;
    await this.actor.update({ "system.tension": tension });
  }
}