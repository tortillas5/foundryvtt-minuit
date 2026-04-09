/**
 * Extend the basic ActorSheetV2 with some very simple modifications
 * @extends {ActorSheetV2}
 */

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class MinuitActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  /**
   * Configuration.
   * 
   * @override
   */
  static DEFAULT_OPTIONS = {
    classes: ["minuit", "sheet", "actor"],
    position: {
      width: 600,
      height: 600,
    },
    window: {
      resizable: true,
    },
    actions: {
      itemCreate: MinuitActorSheet._onItemCreate,
      itemEdit: MinuitActorSheet._onItemEdit,
      itemDelete: MinuitActorSheet._onItemDelete,
      tensionPlus: MinuitActorSheet._onTensionPlus,
      tensionMinus: MinuitActorSheet._onTensionMinus,
      coche: MinuitActorSheet._onCoche,
      roll: MinuitActorSheet._onRoll,
      useParticularity: MinuitActorSheet._onUseParticularity,
    },
    form: {
      submitOnChange: true,
    },
  };

  /**
   * Retourne un objet de contexte pour le template.
   * 
   * @override
   */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.items = this.actor.items;
    context.dtypes = ["String", "Number", "Boolean"];
    context.tabs = this._prepareTabs("primary");
    return context;
  }

  async _preparePartContext(partId, context) {
    if (context.tabs?.[partId]) context.tab = context.tabs[partId];
    return context;
  }

  /**
   * Créer un item embarqué.
   * @param {PointerEvent} event
   * @param {HTMLElement} target L'élément portant data-action
   */
  static async _onItemCreate(event, target) {
    event.preventDefault();

    const type   = target.dataset.type;
    const system = foundry.utils.duplicate(target.dataset);

    const typeName = this.getTypeName(type);
    const name     = game.i18n.format("MINUIT.Common.new_item", { item: typeName });

    const itemData = { name, type, system };

    if (type === "particularite") {
      itemData.system.type = system.label;
      delete itemData.system["label"];
    } else {
      delete itemData.system["type"];
    }

    const [created] = await this.actor.createEmbeddedDocuments("Item", [itemData]);
    this.actor.getEmbeddedDocument("Item", created.id).sheet.render(true);
  }

  /**
   * Ouvrir la fiche d'un item.
   * Dans le HTML : <a data-action="itemEdit" data-item-id="...">
   */
  static _onItemEdit(event, target) {
    event.preventDefault();
    const itemId = target.closest("[data-item-id]")?.dataset.itemId ?? target.dataset.itemId;
    this.actor.getEmbeddedDocument("Item", itemId)?.sheet.render(true);
  }

  /**
   * Supprimer un item embarqué.
   * Dans le HTML : <a data-action="itemDelete" data-item-id="...">
   */
  static async _onItemDelete(event, target) {
    event.preventDefault();
    const itemId = target.closest("[data-item-id]")?.dataset.itemId ?? target.dataset.itemId;
    await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
  }

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

  getTypeName(type) {
    const key = {
      arme:         "MINUIT.Type.arme",
      particularite: "MINUIT.Type.particularite",
      possession:   "MINUIT.Type.possession",
      historique:   "MINUIT.Type.historique",
      contact:      "MINUIT.Type.contact",
    }[type] ?? "MINUIT.Type.default";

    return game.i18n.localize(key);
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

// 221b-baker-street-sheet.js
export class Minuit221bActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/actor/221b-baker-street-sheet.html"
    }
  };
}

// 221b-baker-street-sheet.js
export class MinuitCharacterActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/actor/221b-baker-street-sheet.html"
    }
  };
}

// 221b-baker-street-sheet.js
export class MinuitDirectriceActorSheet extends MinuitActorSheet {
  static PARTS = {
    sheet: {
      template: "systems/minuit/templates/actor/221b-baker-street-sheet.html"
    }
  };
}