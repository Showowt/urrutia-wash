// /ops — root redirect to queue
import { redirect } from "next/navigation";

export default function OpsRootPage() {
  redirect("/ops/queue");
}
