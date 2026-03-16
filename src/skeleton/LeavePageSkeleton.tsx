import { Skeleton } from '@mui/material'


const LeavePageSkeleton = () => {
  return (
     <div className="w-full px-4 py-3">
    

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

export default LeavePageSkeleton