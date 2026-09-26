/**
 * MulanPR API Service — HTTP client for the Express backend on port 1018.
 * All /api/* calls are proxied by webpack-dev-server in development.
 */

const API_BASE = '';  // relative — proxied in dev, same-origin in prod

export class ApiService {

    static async getHealth(): Promise<{ status: string; port: number; time: string }> {
        const res = await fetch(`${API_BASE}/api/health`);
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
    }

    static async getSettings(): Promise<any> {
        const res = await fetch(`${API_BASE}/api/settings`);
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
    }

    static async saveSettings(settings: Record<string, any>): Promise<any> {
        const res = await fetch(`${API_BASE}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
    }

    static async testConnection(target: string): Promise<{ success: boolean; message: string }> {
        const res = await fetch(`${API_BASE}/api/test-connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target })
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
    }

    static async triggerReview(owner: string, repo: string, prNumber: number): Promise<any> {
        const res = await fetch(`${API_BASE}/api/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner, repo, prNumber })
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        return res.json();
    }
}
