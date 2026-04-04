export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-40">

      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-8 text-xl font-semibold text-gray-800">
        Curating your Experience..
      </p>

    </div>
  );
}