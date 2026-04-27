/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheetV2}
 */

const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class MinuitItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  /**
   * Configuration.
   * 
   * @override
   */
  static DEFAULT_OPTIONS = {
    classes: ["minuit", "sheet", "item"],
    position: {
      width: 520,
      height: 480,
    },
    window: {
      resizable: true,
    },
    form: {
      submitOnChange: true,
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.item = this.item;
    context.system = this.item.system;
    context.owner = this.item.isOwner;
    context.cssClass = this.isEditable ? "editable" : "locked";

    if (this.item.type === "particularite") {
      context.particulariteTypes = {
        force: game.i18n.localize("MINUIT.ParticulariteTypes.Force"),
        faiblesse: game.i18n.localize("MINUIT.ParticulariteTypes.Faiblesse"),
      };
    }

    if (this.item.type === "contact") {
      context.categorieInfluence = {
        informelle: game.i18n.localize("MINUIT.CategorieInfluence.informelle"),
        institutionnelle: game.i18n.localize("MINUIT.CategorieInfluence.institutionnelle"),
        intellectuelle: game.i18n.localize("MINUIT.CategorieInfluence.intellectuelle"),
        interlope: game.i18n.localize("MINUIT.CategorieInfluence.interlope"),
        paranaturelle: game.i18n.localize("MINUIT.CategorieInfluence.paranaturelle"),
      };
    }

    return context;
  }
}
