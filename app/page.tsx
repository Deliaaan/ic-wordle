import GameBoard from "./components/GameBoard";
import { ToastContainer, Bounce } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css"; // no se si necesito esto realmente xd

export default function Home() {
  return (
    <main className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        <img src="/ic.png" alt="IC logo" className="h-8 w-auto" />
        <span>Wordle</span>
      </h1>
      <GameBoard />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
    </main>
  );
}