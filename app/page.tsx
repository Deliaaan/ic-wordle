import GameBoard from "./components/GameBoard";

export default function Home() {
  return (
    <main className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold text-center mb-8">IC Wordle</h1>
      <GameBoard />
    </main>
  );
}