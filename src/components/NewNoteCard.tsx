import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [showOnBoarding, setShowOnBoarding] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState<string>('');

  function handleStartEditor() {
    setShowOnBoarding((prevState) => !prevState);
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);

    if (e.target.value === '') {
      setShowOnBoarding(true);
    }
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();

    if (content === '') {
      return;
    }

    onNoteCreated(content);

    setContent('');
    setShowOnBoarding(true);

    toast.success('Nota criada com sucesso!');
  }

  function handleStartRecorder() {
    const isSpeechRecongitionAPIAvailable =
      'SpeechRecognition' in window || 'webspeechRecognition';

    if (!isSpeechRecongitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação');
      return;
    }

    setIsRecording(true);

    setShowOnBoarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (e) => {
      const transcription = [...e.results].reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');

      setContent(transcription);
    };

    speechRecognition.onerror = (err) => {
      console.log(err);
    };

    speechRecognition.start();
  }

  function handleStopRecorder() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 text-left gap-3">
        <span className="text-small font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-small leading-6 text-slate-400">
          Grave uma nota em aúdio que será convertida para texto automaticamente
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1/5 text-slate-400 hover:text-slate-100">
            <X className="size-8" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-small font-medium text-slate-200">
                Adicionar Nota
              </span>

              {showOnBoarding ? (
                <p className="text-small leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecorder}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  onChange={handleContentChange}
                  autoFocus
                  value={content}
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                />
              )}
            </div>

            {isRecording ? (
              <button
                className="w-full flex items-center gap-2 justify-center bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none hover:text-slate-100"
                type="button"
                onClick={handleStopRecorder}
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none hover:bg-lime-500"
                type="button"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
