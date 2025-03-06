export const Card = ({ children }: { children: React.ReactNode }) => {
    return <div className="border p-4 rounded-lg shadow">{children}</div>;
  };
  
  export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={className}>{children}</div>;
  };