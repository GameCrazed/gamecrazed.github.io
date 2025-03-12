CREATE TABLE "BasicConditions" (
	"ConditionId"	INTEGER,
	"ConditionName"	TEXT NOT NULL,
	"Description"	TEXT NOT NULL,
	"DescriptionSummary"	TEXT NOT NULL,
	"AccompanyingCondition"	TEXT,
	"Supersedes"	TEXT,
	"SupersededBy"	TEXT,
	PRIMARY KEY("ConditionId" AUTOINCREMENT)
);