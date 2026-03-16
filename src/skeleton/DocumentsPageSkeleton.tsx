import { Skeleton } from '@mui/material'


const DocumentsPageSkeleton = () => {
  return (
     <div className="w-full p-0 h-[calc(90vh-100px)]">

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-3 gap-6 px-2  mx-auto  py-3 overflow-hidden ">

             {[...Array(9)].map((_, i) => (
               <Skeleton
                 key={i}
                 animation="wave"
                 variant="rounded"
                 width={400}
                 height={170}
               />
             ))}
             </div>
      
   
       </div>
  )
}

export default DocumentsPageSkeleton