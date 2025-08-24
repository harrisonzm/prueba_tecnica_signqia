import dynamic from "next/dynamic";
const NuevoRegistro = dynamic(() => import("@/components/views/MarcasForm"), { ssr: true });

export default function Page() {
  return <NuevoRegistro mode="create" />;
}