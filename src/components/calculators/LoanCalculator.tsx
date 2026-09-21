'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoanCalculator() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');

  const result = useMemo(() => {
    const p = Number(principal);
    const annual = Number(annualRate);
    const termYears = Number(years);

    if (
      !Number.isFinite(p) ||
      !Number.isFinite(annual) ||
      !Number.isFinite(termYears) ||
      p <= 0 ||
      annual < 0 ||
      termYears <= 0
    ) {
      return null;
    }

    const monthlyRate = annual / 100 / 12;
    const months = termYears * 12;

    let monthlyPayment: number;

    if (monthlyRate === 0) {
      monthlyPayment = p / months;
    } else {
      monthlyPayment =
        (p * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
    }

    const totalPayment = monthlyPayment * months;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest: totalPayment - p,
    };
  }, [principal, annualRate, years]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-foreground">
        Loan Calculator
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Estimate monthly loan payments and total interest.
      </p>

      <div className="mt-5 space-y-3">
        <Input
          type="number"
          min="0"
          value={principal}
          onChange={(event) => setPrincipal(event.target.value)}
          placeholder="Loan amount (₹)"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={annualRate}
            onChange={(event) => setAnnualRate(event.target.value)}
            placeholder="Interest %"
          />

          <Input
            type="number"
            min="1"
            value={years}
            onChange={(event) => setYears(event.target.value)}
            placeholder="Years"
          />
        </div>

        <Button className="w-full">
          Calculate Loan
        </Button>
      </div>

      {result && (
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">
              Monthly
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {formatCurrency(result.monthlyPayment)}
            </p>
          </div>

          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">
              Total payment
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {formatCurrency(result.totalPayment)}
            </p>
          </div>

          <div className="rounded-xl bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">
              Interest
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {formatCurrency(result.totalInterest)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}