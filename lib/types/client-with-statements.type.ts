import { Client } from "./client.type";
import { Statement } from "./statement.type";

export type ClientWithStatements = Client & {
  statements: Statement[];
};
