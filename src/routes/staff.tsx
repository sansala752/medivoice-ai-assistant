import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/medivoice/Sidebar";

export const Route = createFileRoute("/staff")({
  component: StaffLayout,
});

function StaffLayout() {
  return (
    <div className="min-h-screen bg-background md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
