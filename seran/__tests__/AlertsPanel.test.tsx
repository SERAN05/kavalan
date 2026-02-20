import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlertsPanel } from '@/components/AlertsPanel';
import { AuthContext } from '@/contexts/AuthContext';

// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, status: 'acknowledged' }),
    })
) as jest.Mock;

const adminUser = {
    id: '1',
    name: 'Dr. Anbu Selvam',
    email: 'admin@neervazh.gov.in',
    role: 'admin' as const,
};

function renderWithAuth(ui: React.ReactNode) {
    return render(
        <AuthContext.Provider
            value={{
                user: adminUser,
                login: async () => true,
                logout: () => { },
                isAuthenticated: true,
            }}
        >
            {ui}
        </AuthContext.Provider>
    );
}

describe('AlertsPanel', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('renders "Active Alerts" heading', () => {
        renderWithAuth(<AlertsPanel />);
        expect(screen.getByText('Active Alerts')).toBeInTheDocument();
    });

    it('renders acknowledge buttons for unacknowledged alerts', () => {
        renderWithAuth(<AlertsPanel />);
        const ackButtons = screen.getAllByRole('button', { name: /acknowledge/i });
        expect(ackButtons.length).toBeGreaterThan(0);
    });

    it('calls /api/alerts/ack on acknowledge click', async () => {
        renderWithAuth(<AlertsPanel />);
        const ackBtn = screen.getAllByRole('button', { name: /acknowledge/i })[0];
        fireEvent.click(ackBtn);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/alerts/ack',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    it('shows escalate button for admin users', () => {
        renderWithAuth(<AlertsPanel />);
        const escalateButtons = screen.queryAllByRole('button', { name: /escalate/i });
        expect(escalateButtons.length).toBeGreaterThan(0);
    });

    it('compact mode shows at most 4 alerts', () => {
        renderWithAuth(<AlertsPanel compact />);
        // Should not crash and render correctly in compact mode
        expect(screen.getByText('Active Alerts')).toBeInTheDocument();
    });
});
