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
      itemCreate: this._onItemCreate,
      itemEdit: this._onItemEdit,
      itemDelete: this._onItemDelete,
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
    context.owner = this.actor.isOwner;
    context.cssClass = this.isEditable ? "editable" : "locked";
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
}
