import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { clients, statements, transactions } from "./schema";

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Statement = InferSelectModel<typeof statements>;
export type NewStatement = InferInsertModel<typeof statements>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
