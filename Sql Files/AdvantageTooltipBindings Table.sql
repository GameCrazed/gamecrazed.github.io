CREATE TABLE "AdvantageTooltipBindings" (
	"AdvantageId"	INTEGER NOT NULL,
	"TooltipId"	INTEGER NOT NULL,
	FOREIGN KEY("AdvantageId") REFERENCES "Advantages"("AdvantageId"),
	FOREIGN KEY("TooltipId") REFERENCES "Tooltips"("TooltipId")
);