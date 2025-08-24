import dynamic from "next/dynamic";
const NuevoRegistro = dynamic(() => import("@/components/views/NuevoRegistro"), { ssr: true });

export default function Page() {
  return <NuevoRegistro />;
}