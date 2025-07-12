import { Skeleton } from './ui/skeleton';

export function PaystubFormSkeleton() {
  return (
    <>
      <div className="flex justify-center py-8">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <Skeleton key={step} className="h-10 w-32 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex justify-center py-8">
        <div className="flex gap-8 p-6 max-w-7xl w-full">
          {/* Left side - Form skeleton */}
          <div className="flex-1 space-y-4 max-w-md">
            {/* Step indicators */}

            {/* Logo upload skeleton */}
            <div className="flex justify-center mb-6">
              <Skeleton className="h-32 w-32 rounded-lg" />
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
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
          <div className="flex-1 bg-white border rounded-lg p-6 shadow-sm">
            {/* Header with company and employee info */}
            <div className="flex justify-between mb-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" /> {/* Company name */}
                <Skeleton className="h-4 w-32" /> {/* Address line 1 */}
                <Skeleton className="h-4 w-28" /> {/* Address line 2 */}
                <Skeleton className="h-4 w-24" /> {/* Address line 3 */}
                <Skeleton className="h-4 w-32" /> {/* Phone */}
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-6 w-24 ml-auto" /> {/* Employee name */}
                <Skeleton className="h-4 w-32 ml-auto" /> {/* Employee address */}
                <Skeleton className="h-4 w-28 ml-auto" />
                <Skeleton className="h-4 w-24 ml-auto" />
                <Skeleton className="h-4 w-32 ml-auto" />
              </div>
            </div>

            {/* Pay period section */}
            <div className="bg-blue-200 p-3 rounded mb-4 flex justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>

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
              ].map((header, index) => (
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
    </>
  );
}
