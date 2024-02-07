import logo from './assets/Logo.svg';
import { NoteCard } from './components/NoteCard';

export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="nlw expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <div className="rounded-md bg-slate-700 p-5 space-y-3">
          <span className="text-small font-medium text-slate-200">
            Adicionar nota
          </span>
          <p className="text-small leading-6 text-slate-400">
            Grave uma nota em aúdio que será convertida para texto
            automaticamente
          </p>
        </div>

        <NoteCard />
      </div>
    </div>
  );
}
