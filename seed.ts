import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  "projectId": "studio-5533461637-d35e1",
  "appId": "1:746827432965:web:929d12af39e95ece2bc86c",
  "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBt3obKShJE3T4_eYXlvL0o3mRbExLlk5s",
  "authDomain": "studio-5533461637-d35e1.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const podcasts = JSON.parse(fs.readFileSync('/tmp/podcasts.json', 'utf8'));

async function seed() {
  const collRef = collection(db, 'podcasts');
  for (const pod of podcasts) {
    const q = query(collRef, where("url", "==", pod.url));
    const qs = await getDocs(q);
    if (qs.empty) {
      await addDoc(collRef, {
        title: pod.title,
        description: pod.description,
        url: pod.url,
        image: pod.image,
        guest: pod.guest,
        createdAt: new Date()
      });
      console.log('Added', pod.title);
    } else {
      console.log('Skipped', pod.title);
    }
  }
  console.log('Done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
