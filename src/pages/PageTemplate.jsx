export function PageTemplate({ children }) {
  return (
    <div className="flex flex-col items-center w-screen h-screen bg-blue-500">
      <p className="my-5 text-2xl font-bold text-center text-white">Game</p>

      {children}
    </div>
  );
}
