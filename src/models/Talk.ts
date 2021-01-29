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
  modelToDocumentData,
  ToDocumentData,
} from "./DataRecord";

export interface Talk extends DataRecord {
  body: string;
  userId: string;
}

export type TalkData = ToDocumentData<Talk>;
export type TalkReference = DocumentReference<TalkData>;
export type TalkCollectionReference = CollectionReference<TalkData>;
export type TalkQuery = Query<TalkData>;

export async function postTalk(userId: string, talk: Talk): Promise<Talk> {
  const coll = getTalkCollection();
  const doc = await coll.add({
    ...talkToData(talk),
    userId,
    createdAt: Timestamp.now(),
  });

  return {
    ...talk,
    id: doc.id,
    userId,
  };
}

export function getUserTalkCollection(userId: string): TalkQuery {
  return getTalkCollection().where("userId", "==", userId);
}

function getTalkCollection(): TalkCollectionReference {
  return db.collection(
    "talks"
  ) as firebase.firestore.CollectionReference<TalkData>;
}

export function createTalk(initial?: Partial<Talk>): Talk {
  return {
    ...createDataRecord(initial),
    body: initial?.body || "",
    userId: initial?.userId || "",
  };
}

export function talkToData(talk: Talk): TalkData {
  return modelToDocumentData(talk);
}

export function ssToTalk(ss: firebase.firestore.QueryDocumentSnapshot): Talk {
  if (!ss.exists) {
    return createTalk({ body: "No longer exist" });
  }

  const data = ss.data();
  return createTalk({
    ...data,
    id: ss.id,
  });
}
