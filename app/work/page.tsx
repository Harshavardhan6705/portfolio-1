import { redirect } from "next/navigation";

// The portfolio is now one continuous page. This route is kept only so that
// old links to /work land on the same single-page experience.
export default function WorkPage() {
  redirect("/");
}
