"use client";

import { ArrowUp } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
  isLoading: boolean;
};

const MAX_LENGTH = 500;

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize the textarea up to ~4 rows.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 112)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 bg-white px-4 pt-3 pb-2"
    >
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a service or program..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none border-0 border-b border-gray-200 bg-transparent px-0 pb-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:border-primary focus:ring-0 transition-colors max-h-28 disabled:opacity-60"
            aria-label="Chat message"
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={[
            "shrink-0 mb-2 grid h-9 w-9 place-items-center rounded-full bg-secondary text-[#FEF9E0] shadow-sm transition",
            canSend
              ? "hover:brightness-90 hover:scale-105"
              : "opacity-50 cursor-not-allowed",
          ].join(" ")}
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="mt-1.5 text-[10px] text-gray-400 text-center">
        Powered by AI · Replies may be inaccurate · Free to use
      </p>
    </form>
  );
}
