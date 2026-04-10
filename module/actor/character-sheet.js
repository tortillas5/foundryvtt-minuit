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

  /**
   * Configuration.
   * 
   * @override
   */
  static DEFAULT_OPTIONS = {
    actions: {
      useParticularity: MinuitCharacterActorSheet._onUseParticularity,
    },
  };

    /**
   * Utiliser une particularité.
   * Dans le HTML : <a data-action="useParticularity" data-item-id="...">
   */
  static async _onUseParticularity(event, target) {
    event.preventDefault();
    const itemId = target.dataset.itemId;

    const particularite = this.actor.items.find(
      i => i.type === "particularite" && i.id === itemId
    );
    if (!particularite) return;

    const currentAdrenaline = this.actor.system.adrenaline.value;
    const adrenalineMax     = this.actor.system.adrenaline.max;
    let message;

    if (particularite.system.type === "force") {
      if (currentAdrenaline >= particularite.system.value) {
        const newAdrenaline = currentAdrenaline - particularite.system.value;
        await this.actor.update({ "system.adrenaline.value": newAdrenaline });
        message = particularite.name +
          game.i18n.format("MINUIT.Messages.particularite_usage_used_adrenaline", {
            value: particularite.system.value,
          });
      } else {
        message = particularite.name +
          game.i18n.localize("MINUIT.Messages.particularite_usage_out_of_adrenaline");
      }
    } else if (particularite.system.type === "faiblesse") {
      const newAdrenaline = Math.min(
        currentAdrenaline + particularite.system.value,
        adrenalineMax
      );
      await this.actor.update({ "system.adrenaline.value": newAdrenaline });
      message = particularite.name +
        game.i18n.format("MINUIT.Messages.particularite_usage_added_adrenaline", {
          value: particularite.system.value,
        });
    }

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor:  game.i18n.localize("MINUIT.Messages.particularite_usage"),
      content: message,
    });
  }
}
