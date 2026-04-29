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
import {
  Minuit221bData,
  MinuitArmeData,
  MinuitCharacterData,
  MinuitContactData,
  MinuitDirectriceData,
  MinuitHistoriqueData,
  MinuitParticulariteData,
  MinuitPossessionData
} from "./data-models.js";

Hooks.once('init', async function() {
  const { DocumentSheetConfig } = foundry.applications.apps;

  game.minuit = {
    MinuitActor,
    MinuitItem
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = MinuitActor;
  CONFIG.Item.documentClass = MinuitItem;

  // Define system data models.
  CONFIG.Actor.dataModels.character = MinuitCharacterData;
  CONFIG.Actor.dataModels["221b-baker-street"] = Minuit221bData;
  CONFIG.Actor.dataModels.directrice = MinuitDirectriceData;

  CONFIG.Item.dataModels.arme = MinuitArmeData;
  CONFIG.Item.dataModels.particularite = MinuitParticulariteData;
  CONFIG.Item.dataModels.possession = MinuitPossessionData;
  CONFIG.Item.dataModels.historique = MinuitHistoriqueData;
  CONFIG.Item.dataModels.contact = MinuitContactData;

  //#region Register minuit sheets

  // Actors
  DocumentSheetConfig.registerSheet(Actor, "minuit", MinuitActorSheet, { makeDefault: true });
  DocumentSheetConfig.registerSheet(Actor, "minuit", Minuit221bActorSheet, { types: ["221b-baker-street"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Actor, "minuit", MinuitCharacterActorSheet, { types: ["character"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Actor, "minuit", MinuitDirectriceActorSheet, { types: ["directrice"], makeDefault: true });

  // Items
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitItemSheet, { makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitArmeItemSheet, { types: ["arme"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitContactItemSheet, { types: ["contact"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitHistoriqueItemSheet, { types: ["historique"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitParticulariteItemSheet, { types: ["particularite"], makeDefault: true });
  DocumentSheetConfig.registerSheet(Item, "minuit", MinuitPossessionItemSheet, { types: ["possession"], makeDefault: true });

  //#endregion

});
