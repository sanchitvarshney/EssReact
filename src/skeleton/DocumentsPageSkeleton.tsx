import { Skeleton } from '@mui/material'


const DocumentsPageSkeleton = () => {
  return (
     <div className="w-full p-0 h-[calc(90vh-100px)]">
    
          
             <div className="w-full flex flex-wrap items-center justify-between mb-0">
               <Skeleton variant="text" width={250} height={32} />
               <div className="flex items-center gap-2">
                <Skeleton variant="rounded" width={"40ch"} height={30} />
               </div>
             </div>
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