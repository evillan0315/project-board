import { editorContent, editorHistory, editorFuture } from '../stores/editorContent';

export function undoEdit() {
  const history = editorHistory.get();
  if (history.length > 1) {
    const newFuture = [history.pop()!, ...editorFuture.get()];
    editorHistory.set([...history]);
    editorContent.set(history[history.length - 1]);
    editorFuture.set(newFuture);
  }
}

export function redoEdit() {
  const future = editorFuture.get();
  if (future.length > 0) {
    const next = future[0];
    editorContent.set(next);
    editorHistory.set([...editorHistory.get(), next]);
    editorFuture.set(future.slice(1));
  }
}
