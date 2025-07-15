import { Skeleton } from '@mui/material'


const LeaveGrantPageSkeleton = () => {
  return (
     <div className="w-full px-4 py-3">
      <div className="flex w-full justify-between items-center flex-wrap gap-2   ">
        <div className="flex gap-[2px] flex-wrap">
            <Skeleton variant="rounded" animation="wave" width={200} height={32} />
        </div>
      
      </div>

      <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4  gap-4  ">
         {[...Array(6)].map((_, i) => (
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

export default LeaveGrantPageSkeleton