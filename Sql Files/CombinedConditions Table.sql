CREATE TABLE "CombinedConditions" (
	"CombinedConditionsId"	INTEGER,
	"ConditionName"	TEXT NOT NULL,
	"Description"	TEXT NOT NULL,
	"DescriptionSummary"	TEXT NOT NULL,
	"BasicConditions"	TEXT,
	PRIMARY KEY("CombinedConditionsId" AUTOINCREMENT)
);