import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal.lib";

export default async function Home() {
	const session = await verifySession();
	if (session.isAuth) redirect("/dashboard");
}
