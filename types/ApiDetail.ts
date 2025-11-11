export interface APIDetail<Type, Item, Extra = undefined> {
  type: Type;
  object: Item;
  extra?: Extra;
}