import dynamic from "next/dynamic";
const MarcasLista = dynamic(() => import("@/components/views/MarcasLista"), { ssr: true });
export default function Page() {
  return <MarcasLista />;
}