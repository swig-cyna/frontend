export const DashboardHeader = ({ heading, text, children }) => (
  <div className="flex items-center justify-between border-b px-6 py-4">
    <div className="grid gap-1">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
    {children}
  </div>
)
