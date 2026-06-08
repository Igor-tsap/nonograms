interface MessageBubbleProps {
  username: string;
  message: string;
  isOwn: boolean;
}

export function MessageBubble({ username, message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}>
      {!isOwn && (
        <span className="text-xs font-medium text-stone-400 px-1">{username}</span>
      )}
      <div
        className={`
          max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? "bg-stone-800 text-stone-50 rounded-br-sm"
            : "bg-stone-100 text-stone-800 rounded-bl-sm"
          }
        `}
      >
        {message}
      </div>
    </div>
  );
}