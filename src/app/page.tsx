import { verifySession } from "@/lib/dal.lib";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await verifySession();
  if (session.isAuth) redirect('/dashboard')
}
