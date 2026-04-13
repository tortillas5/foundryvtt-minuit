/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MinuitActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system;
    const items = this.items;

    system.possessions = items
      .filter(item => item.type === "possession")
      .sort((a, b) => a.name.localeCompare(b.name));

    switch (this.type) {
      case "character":
        this._prepareCharacterData();
        break;

      case "221b-baker-street":
        this._prepareCabinetData();
        break;
    }
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData() {
    const system = this.system;
    const items = this.items;

    system.armes = items
      .filter(item => item.type === "arme")
      .sort((a, b) => a.name.localeCompare(b.name));

    system.forces = items
      .filter(item => item.type === "particularite" && item.system.type==="force")
      .sort((a, b) => a.name.localeCompare(b.name));

    system.faiblesses = items
      .filter(item => item.type === "particularite" && item.system.type==="faiblesse")
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const [key, aspect] of Object.entries(system.aspects)) {
      aspect.nom = game.i18n.localize(`MINUIT.Aspects.${key}`);
    }
  }

  /**
   * Prepare Cabinet type specific data
   */
  _prepareCabinetData() {
    const system = this.system;
    const items = this.items;

    system.historiques = items
      .filter(item => item.type === "historique")
      .sort((a, b) => a.name.localeCompare(b.name));

    system.contacts = items
      .filter(item => item.type === "contact")
      .sort((a, b) => a.system.categorie.localeCompare(b.system.categorie) || a.name.localeCompare(b.name));

    for (const [key, contact] of Object.entries(system.contacts)) {
      contact.categorieDesc = game.i18n.localize(`MINUIT.CategorieInfluence.${contact.system.categorie}`);
    }
  }

  static async create(data, options) {
    if (data.type === "221b-baker-street" && !data.img) {
      data.img = "systems/minuit/images/221b.webp";
    }

    return super.create(data, options);
  }
}