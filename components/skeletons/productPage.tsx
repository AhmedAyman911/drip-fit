export default function ProductPageSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-10 px-6 lg:px-32 lg:pt-32 pt-24 pb-10 lg:pb-0 animate-pulse">
            <div className="relative w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm h-80 sm:max-w-md lg:max-w-lg lg:h-[512px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>

            <div className="flex flex-col gap-4 lg:gap-6 lg:w-1/2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />

                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />

                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />

                <div className="flex flex-col space-y-3 ">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="flex space-x-3">
                        <div className="rounded-full! w-8 h-8 border bg-gray-200 dark:bg-gray-700 " />
                        <div className="rounded-full! w-8 h-8 border bg-gray-200 dark:bg-gray-700 " />
                        <div className="rounded-full! w-8 h-8 border bg-gray-200 dark:bg-gray-700 " />
                    </div>
                </div>

                <div className="flex flex-col space-y-3 ">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="flex space-x-3">
                        <div className=" w-8 h-8 border bg-gray-200 dark:bg-gray-700 rounded " />
                        <div className=" w-8 h-8 border bg-gray-200 dark:bg-gray-700 rounded " />
                        <div className=" w-8 h-8 border bg-gray-200 dark:bg-gray-700 rounded " />
                        <div className=" w-8 h-8 border bg-gray-200 dark:bg-gray-700 rounded " />
                    </div>
                </div>
                <div className="mt-4 w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg " />
                <div className="flex-col space-y-3 pb-12">
                    <div className="mt-4 w-full h-12 bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-4 w-full h-12 bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-4 w-full h-12 bg-gray-200 dark:bg-gray-700 " />
                </div>


            </div>
        </div>
    );
}