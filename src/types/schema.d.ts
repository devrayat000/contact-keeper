export type Schema<T> = T extends Array<infer I>
  ? SchemaArray<I>
  : T extends object
  ? SchemaObj<T>
  : T extends string | number
  ? SchemaVal<T>
  : undefined;

type SchemaObj<T extends object> = {
  type: "object";
  properties: {
    [P in keyof T]: Schema<T[P]>;
  };
  required?: (keyof T)[];
};

interface SchemaArray<I> {
  type: "array";
  maxItems?: number;
  items: Schema<I>;
  default?: I[];
}

interface SchemaVal<T extends string | number> {
  type: T extends string ? "string" : "number";
  [key: string]: any;
}
