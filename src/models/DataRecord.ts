import firebase from "firebase";
import { Timestamp } from "../misc/firebase";

export interface DataRecord {
  createdAt: number;
  id: string;
}

export type ToDocumentData<T extends DataRecord> = Omit<
  T,
  "id" | "createdAt"
> & {
  createdAt: Timestamp;
};

export function modelToDataRecord<T extends DataRecord>(
  model: T
): ToDocumentData<T> {
  const { id, createdAt, ...data } = model;
  return { ...data, createdAt: new firebase.firestore.Timestamp(createdAt, 0) };
}
