import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";

type RecordValue = string | number | boolean | null | undefined | Record<string, unknown> | Array<unknown>;
type PersistableRecord = Record<string, RecordValue>;

const dataDir = process.env.DATA_DIR || ".data";
const dataRoot = join(/*turbopackIgnore: true*/ process.cwd(), dataDir);

async function ensureDataDir() {
  await mkdir(dataRoot, { recursive: true });
}

async function appendJsonLine(fileName: string, payload: PersistableRecord) {
  await ensureDataDir();
  const filePath = join(dataRoot, fileName);
  const line = `${JSON.stringify(payload)}\n`;
  await appendFile(filePath, line, { encoding: "utf-8" });
}

export async function persistLead(payload: PersistableRecord) {
  await appendJsonLine("leads.jsonl", payload);
}

export async function persistEvent(payload: PersistableRecord) {
  await appendJsonLine("events.jsonl", payload);
}
