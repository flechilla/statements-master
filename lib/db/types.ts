import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { statements, transactions } from "./tables/statements.table";

export type Statement = InferSelectModel<typeof statements>;
export type NewStatement = InferInsertModel<typeof statements>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
