import firebase from "firebase/app";
import {
  CollectionReference,
  createDataRecord,
  DataRecord,
  db,
  DocumentReference,
  Query,
  Timestamp,
} from "../misc/firebase";

export interface Task extends DataRecord {
  title: string;
  userId: string;
}

export type TaskData = Omit<Task, "id">;
export type TaskReference = DocumentReference<TaskData>;
export type TaskCollectionReference = CollectionReference<TaskData>;
export type TaskQuery = Query<TaskData>;

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

export function getUserTaskCollection(userId: string): TaskQuery {
  return getTaskCollection().where("userId", "==", userId);
}

function getTaskCollection(): TaskCollectionReference {
  return db.collection(
    "tasks"
  ) as firebase.firestore.CollectionReference<TaskData>;
}

export function createTask(initial?: Partial<Task>): Task {
  return {
    ...createDataRecord(),
    title: "",
    userId: "",
    ...initial,
  };
}

export function taskToData(task: Task): TaskData {
  const { id, ...data } = task;
  return data;
}

export function ssToTask(ss: firebase.firestore.QueryDocumentSnapshot): Task {
  if (!ss.exists) {
    return createTask({ title: "No longer exist" });
  }

  const data = ss.data();
  return createTask({
    ...data,
    id: ss.id,
  });
}
