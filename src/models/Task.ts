import firebase from "firebase/app";
import {
  CollectionReference,
  db,
  DocumentReference,
  Query,
  Timestamp,
} from "../misc/firebase";
import {
  createDataRecord,
  DataRecord,
  DocumentData,
  isDocumentData,
  modelToDocumentData,
} from "./DataRecord";

export interface Task extends DataRecord {
  archived: boolean;
  complete: boolean;
  title: string;
  userId: string;
}

export type TaskData = DocumentData<Task>;
export type TaskReference = DocumentReference<TaskData>;
export type TaskCollectionReference = CollectionReference<TaskData>;
export type TaskQuery = Query<TaskData>;

export type OnTaskEvent = (task: Task, currentTarget?: EventTarget) => void;

export async function postTask(userId: string, task: Task): Promise<Task> {
  const coll = getTaskCollection();
  const doc = await coll.add({
    ...taskToData(task),
    userId,
    createdAt: Timestamp.now(),
  });

  return {
    ...task,
    id: doc.id,
    userId,
  };
}

export async function archiveTasks(tasks: Task[]): Promise<void> {
  const batch = db.batch();

  const data: Partial<Task> = { archived: true };
  tasks.forEach((task) => {
    const doc = getTaskDoc(task);
    batch.update(doc, data);
  });

  return batch.commit();
}

export function completeTask(task: Task, complete: boolean): Promise<void> {
  const doc = getTaskDoc(task);
  return doc.update({ complete });
}

export function deleteTask(task: Task): Promise<void> {
  if (!task.id || !task.userId) {
    throw new Error("To delete, task must exist");
  }

  return getTaskCollection().doc(task.id).delete();
}

export function getUserTaskCollection(userId: string): TaskQuery {
  return getTaskCollection().where("userId", "==", userId);
}

function getTaskCollection(): TaskCollectionReference {
  return db.collection(
    "tasks"
  ) as firebase.firestore.CollectionReference<TaskData>;
}

export function getTaskDoc(task: Task): TaskReference {
  const { id } = task;
  if (!id) {
    throw new Error("ID must have been set");
  }

  return getTaskCollection().doc(id);
}

export function createTask(initial?: Partial<Task> | DocumentData<Task>): Task {
  if (isDocumentData(initial)) {
    const { createdAt, ...data } = initial;
    return createTask({
      createdAt: createdAt.toMillis(),
      ...data,
    });
  }

  return {
    ...createDataRecord(initial),
    archived: initial?.archived || false,
    complete: initial?.complete || false,
    title: initial?.title || "",
    userId: initial?.userId || "",
  };
}

export function taskToData(task: Task): TaskData {
  return modelToDocumentData(task);
}

export function ssToTask(
  ss: firebase.firestore.QueryDocumentSnapshot<DocumentData<Task>>
): Task {
  if (!ss.exists) {
    return createTask({ title: "No longer exist" });
  }

  const data = ss.data();
  return createTask({
    ...data,
    id: ss.id,
  });
}
