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
          url: "/data-store.sqlite3",
          requestChunkSize: 4096, // or another appropriate chunk size in bytes
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );
}

async function fetchJsonTable<T>(filename: string): Promise<T[]> {
  const response = await fetch(filename);
  if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
  return await response.json();
}

async function fetchJsonSingle<T>(
  filename: string,
  filter: (row: T) => boolean
): Promise<T | undefined> {
  const data = await fetchJsonTable<T>(filename);
  return data.find(filter);
}

function logJsonFallback(method: string) {
  // Only warn once per method per session
  if (!(window as any).__jsonFallbackWarned) (window as any).__jsonFallbackWarned = {};
  if (!(window as any).__jsonFallbackWarned[method]) {
    console.warn(`[DB] Falling back to JSON backup in ${method}()`);
    (window as any).__jsonFallbackWarned[method] = true;
  }
}

export async function LoadMeasurements(imperialMetric: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = '${imperialMetric}'`;
    return await worker.db.query(query);
  } catch {
    logJsonFallback("LoadMeasurements");
    return (await fetchJsonTable<any>("/measurements.json")).filter(
      (row: any) => row.MeasurementType === imperialMetric
    );
  }
}

export async function GetMeasurementByMassLbs(massInLbs: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND NumericalMass >= ${massInLbs} ORDER BY NumericalMass ASC LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetMeasurementByMassLbs");
    const data = await fetchJsonTable<any>("/measurements.json");
    return data
      .filter(
        (row: any) => row.MeasurementType === "imperial" && row.NumericalMass >= massInLbs
      )
      .sort((a: any, b: any) => a.NumericalMass - b.NumericalMass)[0];
  }
}

export async function GetMeasurementByRank(rank: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND Rank = ${rank} LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetMeasurementByRank");
    return fetchJsonSingle<any>("/measurements.json", (row) => row.MeasurementType === "imperial" && row.Rank == rank);
  }
}

export async function GetAdvantages() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Advantages ORDER BY AdvantageName`;
    const results = await worker.db.query(query);
    return results;
  } catch {
    logJsonFallback("GetAdvantages");
    return fetchJsonTable<any>("/advantages.json");
  }
}

export async function GetToolTipByTag(tagName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Tooltips WHERE ToolTipTag = '${tagName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetToolTipByTag");
    return fetchJsonSingle<any>("/tooltips.json", (row) => row.ToolTipTag === tagName);
  }
}

export async function GetToolTipById(tooltipId: number) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM Tooltips WHERE TooltipId = '${tooltipId}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetToolTipById");
    return fetchJsonSingle<any>("/tooltips.json", (row) => row.TooltipId == tooltipId);
  }
}

export async function GetBasicConditions() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM BasicConditions ORDER BY ConditionName`;
    const results = await worker.db.query(query);
    return results;
  } catch {
    logJsonFallback("GetBasicConditions");
    return fetchJsonTable<any>("/basicconditions.json");
  }
}

export async function GetBasicConditionByConditionName(conditionName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM BasicConditions WHERE ConditionName = '${conditionName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetBasicConditionByConditionName");
    return fetchJsonSingle<any>("/basicconditions.json", (row) => row.ConditionName === conditionName);
  }
}

export async function GetCombinedConditions() {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM CombinedConditions ORDER BY ConditionName`;
    const results = await worker.db.query(query);
    return results;
  } catch {
    logJsonFallback("GetCombinedConditions");
    return fetchJsonTable<any>("/combinedconditions.json");
  }
}

export async function GetCombinedConditionByConditionName(conditionName: string) {
  try {
    const worker = await InitializeWorker();
    const query = `SELECT * FROM CombinedConditions WHERE ConditionName = '${conditionName}' LIMIT 1`;
    const result = await worker.db.query(query);
    return result[0];
  } catch {
    logJsonFallback("GetCombinedConditionByConditionName");
    return fetchJsonSingle<any>("/combinedconditions.json", (row) => row.ConditionName === conditionName);
  }
}