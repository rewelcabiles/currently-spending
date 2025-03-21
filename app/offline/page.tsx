import { CloudAlert } from "lucide-react";
export default function OfflinePage() {
  return (
    <div className="text-center mt-4">
      <CloudAlert className="w-[64px] h-full mx-auto mb-4" />
      <div className="text-2xl font-bold">You are offline.</div>
      <br/>
      
      <p>Please check your internet connection.</p>
      
    </div>
  );
}
