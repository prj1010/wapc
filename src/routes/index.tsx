import { createFileRoute } from "@tanstack/react-router";
import { DealRoom } from "@/components/deal/deal-room";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <DealRoom />;
}
