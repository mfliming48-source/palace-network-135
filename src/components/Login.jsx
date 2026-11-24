import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Network, ShieldCheck } from "lucide-react";
import { auth } from "../firebase";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setError("");setBusy(true);try{await signInWithEmailAndPassword(auth,email,password);}catch{setError("Não foi possível iniciar sessão. Confirme as credenciais e se o utilizador está activo.");}finally{setBusy(false);}}
  return <main className="login-wrap"><form className="login-card" onSubmit={submit}>
    <div className="login-logo"><Network size={28}/></div><div className="eyebrow">PALACE · TECNOLOGIAS DE INFORMAÇÃO</div>
    <h1>Palace Network 135</h1><p>Acesso à gestão e documentação da rede.</p>
    <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="tecnico@palace.co.mz"/></label>
    <label>Palavra-passe<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="A sua palavra-passe"/></label>
    {error&&<div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy?"A entrar…":"Iniciar sessão"}</button>
    <small><ShieldCheck size={14}/> Acesso restrito à equipa autorizada de TI.</small>
  </form></main>;
}
