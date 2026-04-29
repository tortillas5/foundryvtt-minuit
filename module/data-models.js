const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

class MinuitTypeDataModel extends foundry.abstract.TypeDataModel {
  static text(initial = "") {
    return new StringField({ required: true, nullable: false, initial });
  }

  static integer(initial = 0, options = {}) {
    return new NumberField({ required: true, nullable: false, integer: true, initial, ...options });
  }

  static checkbox(initial = false) {
    return new BooleanField({ required: true, nullable: false, initial });
  }
}

class MinuitActorDataModel extends MinuitTypeDataModel {
  static resource(value, max = value, min = 0) {
    return new SchemaField({
      value: this.integer(value, { min, max }),
      min: this.integer(min),
      max: this.integer(max, { min })
    });
  }

  static defineSchema() {
    return {
      vie: this.resource(6),
      adrenaline: this.resource(6),
      ether: new SchemaField({
        value: this.integer(3, { min: 0 })
      })
    };
  }
}

export class MinuitCharacterData extends MinuitActorDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      concept: this.text(),
      description: this.text(),
      lieuVie: this.text(),
      motivation: this.text(),
      quete: new SchemaField({
        desc: this.text(),
        case1: this.checkbox(),
        case2: this.checkbox()
      }),
      evolution: new SchemaField({
        desc: this.text(),
        value: this.integer(0, { min: 0 })
      }),
      aspects: new SchemaField({
        agilite: new SchemaField({ value: this.integer(2) }),
        perception: new SchemaField({ value: this.integer(2) }),
        puissance: new SchemaField({ value: this.integer(2) }),
        reflexion: new SchemaField({ value: this.integer(2) })
      }),
      expertises: new SchemaField({
        sociales: this.expertise(),
        academiques: this.expertise(),
        pratiques: this.expertise(),
        combat: this.expertise()
      }),
      relations: new SchemaField({
        allie: this.text(),
        nemesis: this.text()
      })
    };
  }

  static expertise() {
    return new SchemaField({
      recharge: this.text(),
      value: this.integer(0, { min: 0 }),
      min: this.integer(0),
      max: this.integer(0, { min: 0 })
    });
  }
}

export class Minuit221bData extends MinuitTypeDataModel {
  static defineSchema() {
    return {
      situation: this.text(),
      concierge: this.text(),
      patrimoine: this.integer(0),
      etatDesLieux: new SchemaField({
        securite: this.text(),
        vestibule: this.text(),
        salon: this.text(),
        bureau: this.text(),
        commodites: this.text()
      })
    };
  }
}

export class MinuitDirectriceData extends MinuitTypeDataModel {
  static defineSchema() {
    return {
      tension: this.integer(6, { min: 0 }),
      notes: this.text()
    };
  }
}

class MinuitItemDataModel extends MinuitTypeDataModel {
  static defineSchema() {
    return {
      description: this.text()
    };
  }
}

export class MinuitArmeData extends MinuitItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      degats: this.text()
    };
  }
}

export class MinuitPossessionData extends MinuitItemDataModel {}

export class MinuitParticulariteData extends MinuitItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      type: this.text(),
      value: this.integer(0)
    };
  }
}

export class MinuitHistoriqueData extends MinuitItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      coche: this.checkbox()
    };
  }
}

export class MinuitContactData extends MinuitItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      categorie: this.text(),
      coche: this.checkbox()
    };
  }
}
