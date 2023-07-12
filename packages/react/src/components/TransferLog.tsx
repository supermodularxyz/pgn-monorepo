export function TransferLog({ log = [] }: { log: string[] }) {
  if (!log.length) return null;
  return (
    <div className="bg-gray-900 text-gray-50 p-4 font-mono text-xs flex flex-col gap-2 overflow-y-scroll">
      {log.map((msg, i) => (
        <div key={i}>&gt; {msg}</div>
      ))}
    </div>
  );
}
