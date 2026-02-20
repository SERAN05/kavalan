import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/MetricCard';

describe('MetricCard', () => {
    it('renders label and value', () => {
        render(<MetricCard label="Active Cases" value={112} />);
        expect(screen.getByText('Active Cases')).toBeInTheDocument();
        expect(screen.getByText('112')).toBeInTheDocument();
    });

    it('renders unit if provided', () => {
        render(<MetricCard label="Risk Index" value={48} unit="/100" />);
        expect(screen.getByText('/100')).toBeInTheDocument();
    });

    it('shows positive delta in red', () => {
        render(<MetricCard label="Cases" value={42} delta={8} />);
        expect(screen.getByText('+8')).toBeInTheDocument();
        expect(screen.getByText('vs last week')).toBeInTheDocument();
    });

    it('shows negative delta in green', () => {
        render(<MetricCard label="Risk" value={30} delta={-5} />);
        expect(screen.getByText('-5')).toBeInTheDocument();
    });

    it('renders description when no delta', () => {
        render(<MetricCard label="Temp" value={30} description="Across all wards" />);
        expect(screen.getByText('Across all wards')).toBeInTheDocument();
    });

    it('has accessible aria-label', () => {
        render(<MetricCard label="Cases" value={10} unit=" cases" />);
        expect(screen.getByRole('article')).toHaveAttribute(
            'aria-label',
            'Cases: 10 cases'
        );
    });
});
