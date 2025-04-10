CREATE TABLE "statements" (
	"id" serial PRIMARY KEY NOT NULL,
	"statement_period" text NOT NULL,
	"bank_name" varchar(255) NOT NULL,
	"card_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"statement_id" serial NOT NULL,
	"date" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"justification" varchar(1000),
	"category" varchar(255) DEFAULT 'business_expense',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_statement_id_statements_id_fk" FOREIGN KEY ("statement_id") REFERENCES "public"."statements"("id") ON DELETE no action ON UPDATE no action;