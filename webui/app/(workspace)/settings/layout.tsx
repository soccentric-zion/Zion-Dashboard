export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Connection, system info, preferences, and firmware updates.</p>
            </div>
            {children}
        </div>
    );
}