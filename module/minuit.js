// Import Modules
import { MinuitActor } from "./actor/actor.js";
import { MinuitActorSheet } from "./actor/actor-sheet.js";
import { Minuit221bActorSheet } from "./actor/221b-baker-street-sheet.js";
import { MinuitCharacterActorSheet } from "./actor/character-sheet.js";
import { MinuitDirectriceActorSheet } from "./actor/directrice-sheet.js";
import { MinuitItem } from "./item/item.js";
import { MinuitItemSheet } from "./item/item-sheet.js";
import { MinuitArmeItemSheet } from "./item/arme-sheet.js";
import { MinuitContactItemSheet } from "./item/contact-sheet.js";
import { MinuitHistoriqueItemSheet } from "./item/historique-sheet.js";
import { MinuitParticulariteItemSheet } from "./item/particularite-sheet.js";
import { MinuitPossessionItemSheet } from "./item/possession-sheet.js";

Hooks.once('init', async function() {

  game.minuit = {
    MinuitActor,
    MinuitItem
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = MinuitActor;
  CONFIG.Item.documentClass = MinuitItem;

  // Unregister default sheets.
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);

  //#region Register minuit sheets

  // Actors
  foundry.documents.collections.Actors.registerSheet("minuit", MinuitActorSheet, { makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("minuit", Minuit221bActorSheet, { types: ["221b-baker-street"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("minuit", MinuitCharacterActorSheet, { types: ["character"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("minuit", MinuitDirectriceActorSheet, { types: ["directrice"], makeDefault: true });

  // Items
  foundry.documents.collections.Items.registerSheet("minuit", MinuitItemSheet, { makeDefault: true });
  foundry.documents.collections.Items.registerSheet("minuit", MinuitArmeItemSheet, { types: ["arme"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("minuit", MinuitContactItemSheet, { types: ["contact"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("minuit", MinuitHistoriqueItemSheet, { types: ["historique"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("minuit", MinuitParticulariteItemSheet, { types: ["particularite"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("minuit", MinuitPossessionItemSheet, { types: ["possession"], makeDefault: true });

  //#endregion

});