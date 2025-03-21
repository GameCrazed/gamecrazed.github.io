import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function InitializeWorker() {
  return await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "/MandMDataStore.sqlite3",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );
}

export async function LoadMeasurements(imperialMetric: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = '${imperialMetric}'`;
    return await worker.db.query(query);
  } catch (error) {
    console.error("Error loading Measurements:", error);
    throw error;
  }
}

export async function GetMeasurementByMassLbs(massInLbs: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND NumericalMass >= ${massInLbs} ORDER BY NumericalMass ASC LIMIT 1`;
    const result = await worker.db.query(query);

    return result[0];
  } catch (error) {
    console.error("Error getting Measurement by Mass:", error);
    throw error;
  }
}

export async function GetMeasurementByRank(rank: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND Rank = ${rank} LIMIT 1`;
    const result = await worker.db.query(query);

    return result[0];
  } catch (error) {
    console.error("Error getting Measurement by Rank:", error);
    throw error;
  }
}

export async function GetAdvantages() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Advantages ORDER BY AdvantageName`;
    const results = await worker.db.query(query);
    return results;
  } catch (error) {
    console.error("Error getting Advantages: ", error);
    throw error;
  }
}

export async function GetToolTipByTag(tagName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Tooltips WHERE ToolTipTag = '${tagName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error getting ToolTip: ", error);
    throw error;
  }
}

export async function GetToolTipById(tooltipId: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Tooltips WHERE TooltipId = '${tooltipId}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error getting Tooltip: ", error);
    throw error;
  }
}

export async function GetBasicConditions() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM BasicConditions ORDER BY ConditionName`;
    const results = await worker.db.query(query);
    return results;
  } catch (error) {
    console.error("Error getting Basic Conditions: ", error);
    throw error;
  }
}

export async function GetBasicConditionByConditionName(conditionName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM BasicConditions WHERE ConditionName = '${conditionName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error getting Basic Conditions: ", error);
    throw error;
  }
}

export async function GetCombinedConditions() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM CombinedConditions ORDER BY ConditionName`;
    const results = await worker.db.query(query);
    return results;
  } catch (error) {
    console.error("Error getting Combined Conditions: ", error);
    throw error;
  }
}

export async function GetCombinedConditionByConditionName(conditionName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM CombinedConditions WHERE ConditionName = '${conditionName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error getting Combined Conditions: ", error);
    throw error;
  }
}