import { Skeleton } from '@mui/material'


const LeavePageSkeleton = () => {
  return (
     <div className="w-full px-4 py-3">
      <div className="flex w-full justify-between items-center flex-wrap gap-2   ">
        <div className="flex gap-[2px] flex-wrap">
            <Skeleton variant="rounded" sx={{ borderRadius: 10 }} width={200} height={32} />
        </div>
        <div className="flex gap-[20px] flex-wrap">
        <Skeleton variant="rectangular" width={180} height={45} />
        <Skeleton variant="rectangular" width={180} height={45} />
        </div>
      </div>

      <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4  gap-4  ">
         {[...Array(4)].map((_, i) => (
               <Skeleton
                 key={i}
                 animation="wave"
                 variant="rounded"
                 width={"95%"}
                 height={220}
               />
             ))}
      </div>

    
    </div>
  )
}

export default LeavePageSkeleton