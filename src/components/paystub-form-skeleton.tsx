import { Skeleton } from './ui/skeleton';

export function PaystubFormSkeleton() {
  return (
    <>
      {/* Step indicators */}
      <div className="max-w-7xl flex justify-start py-4 md:py-8 mx-auto">
        <div className="flex gap-1 md:gap-2 overflow-x-auto">
          {[1, 2, 3].map((step) => (
            <Skeleton key={step} className="h-4 w-12 md:h-8 md:w-32 rounded-md flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex justify-center md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl w-full">
          {/* Left side - Form skeleton */}
          <div className="flex-1 space-y-4 md:max-w-md md:mx-auto lg:mx-0">
            <div className="flex justify-center gap-1 md:gap-2 mb-6 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((step) => (
                <Skeleton key={step} className="h-4 w-12 md:h-14 md:w-20 rounded-md" />
              ))}
            </div>
            {/* Logo upload skeleton */}
            <div className="flex justify-start mb-6">
              <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-lg" />
            </div>

            {/* Form fields skeleton */}
            <div className="space-y-4">
              {/* Company name */}
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Company address */}
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Grid fields - Apt/Suite and City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* State and Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Country select */}
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Phone and extension */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Email */}
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Right side - Preview skeleton */}
          <div className="flex-1 bg-white border rounded-lg p-4 lg:p-6 shadow-sm mt-8 lg:mt-0">
            {/* Header with company and employee info */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 mb-6">
              <div className="space-y-2">
                <Skeleton className="h-5 md:h-6 w-20" /> {/* Company name */}
                <Skeleton className="h-3 md:h-4 w-32" /> {/* Address line 1 */}
                <Skeleton className="h-3 md:h-4 w-28" /> {/* Address line 2 */}
                <Skeleton className="h-3 md:h-4 w-24" /> {/* Address line 3 */}
                <Skeleton className="h-3 md:h-4 w-32" /> {/* Phone */}
              </div>
              <div className="space-y-2 sm:text-right">
                <Skeleton className="h-5 md:h-6 w-24 sm:ml-auto" /> {/* Employee name */}
                <Skeleton className="h-3 md:h-4 w-32 sm:ml-auto" /> {/* Employee address */}
                <Skeleton className="h-3 md:h-4 w-28 sm:ml-auto" />
                <Skeleton className="h-3 md:h-4 w-24 sm:ml-auto" />
                <Skeleton className="h-3 md:h-4 w-32 sm:ml-auto" />
              </div>
            </div>

            {/* Pay period section */}
            <div className="bg-blue-200 p-2 md:p-3 rounded mb-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
              <Skeleton className="h-4 md:h-5 w-48" />
              <Skeleton className="h-4 md:h-5 w-32" />
            </div>

            {/* Mobile table - simplified */}
            <div className="block lg:hidden space-y-3">
              {/* Income section */}
              <div className="border rounded p-3 space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Payments section */}
              <div className="bg-blue-100 border rounded p-3 space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Deductions section */}
              <div className="border rounded p-3 space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-18" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Net Pay section */}
              <div className="border rounded p-3 space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block">
              {/* Table header */}
              <div className="grid grid-cols-8 gap-2 mb-3 text-sm font-medium">
                {[
                  'Income',
                  'Rate',
                  'Hours',
                  'This Period',
                  'Year to Date',
                  'Deductions',
                  'Current total',
                  'Year to Date',
                ].map((_header, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>

              {/* Table rows */}
              <div className="space-y-2">
                {/* Hourly row */}
                <div className="grid grid-cols-8 gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Payment section */}
                <div className="bg-blue-100 p-2 rounded grid grid-cols-8 gap-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="col-span-2"></div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Deduction row */}
                <div className="grid grid-cols-8 gap-2">
                  <Skeleton className="h-4 w-18" />
                  <div className="col-span-2"></div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <div className="col-span-3"></div>
                </div>

                {/* Net Pay row */}
                <div className="grid grid-cols-8 gap-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="col-span-2"></div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <div className="col-span-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
