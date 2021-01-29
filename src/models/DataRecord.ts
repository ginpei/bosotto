import { Timestamp } from "../misc/firebase";

export interface DataRecord {
  createdAt: number;
  id: string;
}

export type DocumentData<T extends DataRecord> = Omit<T, "id" | "createdAt"> & {
  createdAt: Timestamp;
};

export function createDataRecord(initial?: Partial<DataRecord>): DataRecord {
  return {
    createdAt: initial?.createdAt || 0,
    id: initial?.id || "",
  };
}

export function modelToDocumentData<T extends DataRecord>(
  model: T
): DocumentData<T> {
  const { id, createdAt, ...data } = model;
  return { ...data, createdAt: new Timestamp(createdAt, 0) };
}

export function isDocumentData<T extends DataRecord>(
  model: Partial<T> | DocumentData<T> | undefined
): model is DocumentData<T> {
  return model?.createdAt instanceof Timestamp;
}
