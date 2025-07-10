import { Skeleton } from '@mui/material';


const PeripheralPageSkeleton = () => {
  return (
     <div className='bg-gray-100 flex min-h-[calc(100vh-90px)] overflow-y-auto p-2 w-full'>
      <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-2">
        {/* Carousel Section */}
        <div className="flex flex-col justify-evenly items-center w-full p-6">
          <div className="w-full flex justify-center">
           <Skeleton variant="rectangular" width={"60%"} height={220} />
          </div>

          <div className="w-full flex justify-center items-center relative mt-2">
            <div className="hidden sm:block mt-0">
            <Skeleton variant="circular" width={40} height={40} />
            </div>
            <div
              className="w-full flex justify-center items-center relative min-h-[180px] sm:min-h-[200px] md:min-h-[220px]"
              style={{ perspective: "1000px" }}
            >
             <Skeleton variant="rectangular" width={"80%"} height={60} />
            </div>
            <div className="hidden sm:block mt-0">
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </div>
          
        </div>
        {/* Details Section */}
        <div className="w-full max-w-2xl m-auto overflow-y-auto h-[60vh] sm:h-[70vh] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col">
         
          <Skeleton variant="rectangular" animation={"wave"}  width={"100%"} height={"100%"} />
        </div>
      </div>
    </div>
  )
}

export default PeripheralPageSkeleton