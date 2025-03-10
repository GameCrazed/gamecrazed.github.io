import '../CSS/main.css';
import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

export async function LoadMeasurements(imperialMetric: string) {
  try {
    const worker = await createDbWorker(
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

    const query = `SELECT * FROM Measurements WHERE MeasurementType = '${imperialMetric}'`;
    return await worker.db.query(query);
  } catch (error) {
    console.error("Error loading measurements:", error);
    throw error;
  }
}

export async function GetMeasurementByMassLbs(massInLbs: number) {
  try {
    const worker = await createDbWorker(
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

    console.log("massLbs:", massInLbs);
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND NumericalMass >= ${massInLbs} ORDER BY NumericalMass ASC LIMIT 1`;
    const result = await worker.db.query(query);

    console.log("result:", result);

    return result[0];
  } catch (error) {
    console.error("Error getting mass rank:", error);
    throw error;
  }
}

export async function GetMeasurementByRank(rank: number) {
  try {
    const worker = await createDbWorker(
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

    console.log("Rank:", rank);
    const query = `SELECT * FROM Measurements WHERE MeasurementType = 'imperial' AND Rank = ${rank} LIMIT 1`;
    const result = await worker.db.query(query);

    console.log("result:", result);

    return result[0];
  } catch (error) {
    console.error("Error getting mass rank:", error);
    throw error;
  }
}