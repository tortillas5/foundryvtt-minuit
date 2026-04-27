import { MinuitActorSheet } from "./actor-sheet.js";

export class MinuitCharacterActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/actor/character-sheet.html",
      scrollable: [".sheet-body .tab.active"],
    },
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
      useParticularity: this._onUseParticularity,
      roll: this._onRoll,
    },
  };

    /**
   * Lancer les dés.
   * Dans le HTML : <a data-action="roll" data-roll="2d6" data-label="agilite">
   */
  static async _onRoll(event, target) {
    event.preventDefault();
    const dataset = target.dataset;

    if (!dataset.roll) return;

    let rollFormula = dataset.roll;
    if (rollFormula.toLowerCase().includes("p")) {
      const puissance = this.actor.system.aspects.puissance.value;
      rollFormula     = rollFormula.toLowerCase().replace("p", puissance);
    }

    const roll       = new Roll(rollFormula, this.actor.system);
    const aspectName = dataset.label ? this.getAspectName(dataset.label) : "";
    const label      = dataset.label
      ? game.i18n.format("MINUIT.Messages.dice_throw", { aspect: aspectName }).capitalize()
      : "";

    await roll.toMessage({
      flavor:  label,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    });
  }

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

  getAspectName(aspect) {
    const key = {
      agilite:    "MINUIT.Aspects.agilite",
      perception: "MINUIT.Aspects.perception",
      puissance:  "MINUIT.Aspects.puissance",
      reflexion:  "MINUIT.Aspects.reflexion",
    }[aspect];

    if (!key) {
      throw new Error("This aspect does not exist.");
    }

    return game.i18n.localize(key);
  }
}
