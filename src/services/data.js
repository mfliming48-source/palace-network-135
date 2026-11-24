import {
  addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query,
  serverTimestamp, setDoc, updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

export const DEFAULT_RANGES = [
  { id:"cameras", name:"Câmaras CCTV", start:2, end:100 },
  { id:"printers", name:"Impressoras / PCs", start:101, end:106 },
  { id:"pbx", name:"PBX", start:107, end:112 },
  { id:"network", name:"Switches / APs", start:113, end:118 },
  { id:"facilities", name:"Refeitórios / biometria / WC", start:120, end:133 },
  { id:"static", name:"IPs estáticos", start:134, end:200 },
  { id:"dhcp", name:"DHCP", start:201, end:240 },
  { id:"reserved", name:"Reserva / livres", start:241, end:253 },
];
export const DEFAULT_CATEGORIES = ["Câmaras CCTV","Impressoras","Computadores","PBX","Switches","Access Points","Televisores","Fingerprints","Torniquetes","Servidores","Outros"];
export const ipDocId = (n) => `192-168-135-${n}`;

export async function seedIpAddresses(uid) {
  const col = collection(db, "ip_addresses");
  const existing = await getDocs(col);
  const ids = new Set(existing.docs.map(d=>d.id));
  let created = 0;
  for (let n=1;n<=254;n++) {
    const id=ipDocId(n);
    if (ids.has(id)) continue;
    const range=DEFAULT_RANGES.find(r=>n>=r.start&&n<=r.end);
    await setDoc(doc(db,"ip_addresses",id), {
      ip:`192.168.135.${n}`, octet:n, equipmentName:"", category:range?.name||"",
      location:"", brand:"", model:"", macAddress:"", notes:"",
      allocationType: n>=201&&n<=240 ? "DHCP" : "Estático",
      usageStatus:"available", connectivityStatus:"not_checked",
      rangeId:range?.id||"", createdAt:serverTimestamp(), updatedAt:serverTimestamp(),
      createdBy:uid, updatedBy:uid
    });
    created++;
  }
  return created;
}
export async function saveIp(ipId,data,uid,isNew=false) {
  const ref=doc(db,"ip_addresses",ipId);
  const payload={...data,updatedAt:serverTimestamp(),updatedBy:uid};
  if(isNew) { payload.createdAt=serverTimestamp(); payload.createdBy=uid; await setDoc(ref,payload); }
  else await updateDoc(ref,payload);
  await addDoc(collection(db,"activity_logs"),{action:isNew?"create_ip":"update_ip",ip:data.ip,description:`${isNew?"Criado":"Actualizado"} registo ${data.ip}`,userId:uid,createdAt:serverTimestamp()});
}
export async function getUserProfile(uid) {
  const snap=await getDoc(doc(db,"users",uid));
  return snap.exists()?{id:snap.id,...snap.data()}:null;
}
export async function loadIps() {
  const snap=await getDocs(query(collection(db,"ip_addresses"),orderBy("octet","asc")));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
export async function loadLogs() {
  const snap=await getDocs(query(collection(db,"activity_logs"),orderBy("createdAt","desc"),limit(50)));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
export async function loadRanges() {
  const snap=await getDocs(collection(db,"ip_ranges"));
  return snap.docs.length?snap.docs.map(d=>({id:d.id,...d.data()})):DEFAULT_RANGES;
}
export async function saveRange(range) {
  await setDoc(doc(db,"ip_ranges",range.id),range);
}
export async function loadCategories() {
  const snap=await getDocs(collection(db,"equipment_categories"));
  return snap.docs.length?snap.docs.map(d=>({id:d.id,...d.data()})):DEFAULT_CATEGORIES.map((name,i)=>({id:`cat-${i}`,name}));
}
