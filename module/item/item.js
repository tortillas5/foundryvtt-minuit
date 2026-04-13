/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MinuitItem extends Item {

  // Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
  static async create(data, options) {
    if (!data.img) {
      data.img = "systems/minuit/images/blank.png";
    }

    return super.create(data, options);
  }
}