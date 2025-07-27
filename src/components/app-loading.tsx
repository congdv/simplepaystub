export function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in">
      <svg
        className="animate-spin h-16 w-16 text-blue-400 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 48 48"
      >
        <circle
          className="opacity-25"
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="6"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M24 4a20 20 0 0120 20h-6a14 14 0 00-14-14V4z"
        />
      </svg>
      <div className="text-black text-lg font-medium">Loading..</div>
    </div>
  );
}