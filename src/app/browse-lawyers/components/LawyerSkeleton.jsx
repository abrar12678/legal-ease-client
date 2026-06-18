export default function LawyerSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="pt-7 pb-3 flex flex-col items-center">
        <div className="w-[88px] h-[88px] rounded-full bg-gray-200 ring-4 ring-white" />
      </div>
      <div className="px-4 pb-4 pt-2 text-center space-y-2">
        <div className="h-5 w-3/4 mx-auto bg-gray-200 rounded" />
        <div className="h-4 w-1/2 mx-auto bg-gray-100 rounded" />
        <div className="flex justify-center gap-1 mt-1">
          <div className="h-3.5 w-3.5 bg-gray-200 rounded" />
          <div className="h-3.5 w-10 bg-gray-200 rounded" />
          <div className="h-3.5 w-12 bg-gray-100 rounded" />
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}