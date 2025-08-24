import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const MarcaForm = dynamic(() => import("@/components/views/MarcasForm"));

export default function Page({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) return notFound();
  return <MarcaForm mode="update" id={idNum} />;
}