import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return <div className="flex-1 w-full flex flex-col gap-4">
        <Skeleton className="w-full h-[20px] rounded-full" />
        <Skeleton className="w-[96] h-[20px] rounded-full" />
      </div>
  }