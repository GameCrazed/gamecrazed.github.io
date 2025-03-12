CREATE TABLE "Tooltips" (
	"TooltipId"	INTEGER UNIQUE,
	"ToolTipTag"	TEXT UNIQUE,
	"ToolTipDescription"	TEXT UNIQUE,
	PRIMARY KEY("TooltipId" AUTOINCREMENT)
);