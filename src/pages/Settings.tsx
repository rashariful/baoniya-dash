import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your application settings and preferences</p>
      </div>
      
      <div className="text-center py-12">
        <SettingsIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium text-foreground">Coming Soon</h3>
        <p className="text-muted-foreground">Settings and configuration options will be available here</p>
      </div>
    </div>
  );
}