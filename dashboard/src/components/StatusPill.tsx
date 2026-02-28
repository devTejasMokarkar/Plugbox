interface StatusPillProps {
  status: string;
}

export default function StatusPill({ status }: StatusPillProps) {
  const cleanStatus = (s: string) => (s || "").trim().toUpperCase();
  const s = cleanStatus(status);
  const isOnline = s === "ONLINE";

  return (
    <span className={isOnline ? "status-online" : "status-offline"}>
      <span 
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-success-500" : "bg-danger-500"
        }`}
      />
      {s}
    </span>
  );
}
