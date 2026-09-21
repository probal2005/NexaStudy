'use client';

import { useState } from 'react';
import { Delete, Divide, Minus, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';

type Operator = '+' | '-' | '×' | '÷' | null;

function calculate(
  first: number,
  second: number,
  operator: Operator,
): number | null {
  if (operator === '+') return first + second;
  if (operator === '-') return first - second;
  if (operator === '×') return first * second;

  if (operator === '÷') {
    if (second === 0) return null;
    return first / second;
  }

  return second;
}

export function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  function inputDigit(digit: string) {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) =>
      current === '0' ? digit : `${current}${digit}`,
    );
  }

  function inputDecimal() {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(`${display}.`);
    }
  }

  function clear() {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  function backspace() {
    if (waitingForOperand) return;

    setDisplay((current) => {
      if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) {
        return '0';
      }

      return current.slice(0, -1);
    });
  }

  function chooseOperator(nextOperator: Operator) {
    const inputValue = Number(display);

    if (!Number.isFinite(inputValue)) return;

    if (storedValue !== null && operator && !waitingForOperand) {
      const result = calculate(storedValue, inputValue, operator);

      if (result === null) {
        setDisplay('Error');
        setStoredValue(null);
        setOperator(null);
        return;
      }

      setDisplay(String(result));
      setStoredValue(result);
    } else {
      setStoredValue(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  function equals() {
    if (storedValue === null || !operator || waitingForOperand) return;

    const inputValue = Number(display);
    const result = calculate(storedValue, inputValue, operator);

    if (result === null) {
      setDisplay('Error');
    } else {
      setDisplay(String(result));
    }

    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 rounded-xl bg-muted/60 p-4 text-right">
        <div className="min-h-8 overflow-x-auto whitespace-nowrap text-2xl font-semibold text-foreground">
          {display}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={clear}>
          AC
        </Button>

        <Button variant="outline" onClick={backspace}>
          <Delete className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((button) => {
          if (button === '=') {
            return (
              <Button
                key={button}
                className="h-12"
                onClick={equals}
              >
                =
              </Button>
            );
          }

          if (button === '.') {
            return (
              <Button
                key={button}
                variant="outline"
                className="h-12"
                onClick={inputDecimal}
              >
                .
              </Button>
            );
          }

          if (['+', '-', '×', '÷'].includes(button)) {
            const icons = {
              '+': Plus,
              '-': Minus,
              '×': X,
              '÷': Divide,
            };

            const Icon = icons[button as keyof typeof icons];

            return (
              <Button
                key={button}
                variant="outline"
                className="h-12"
                onClick={() => chooseOperator(button as Operator)}
                aria-label={`Operator ${button}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          }

          return (
            <Button
              key={button}
              variant="outline"
              className="h-12 text-base"
              onClick={() => inputDigit(button)}
            >
              {button}
            </Button>
          );
        })}
      </div>
    </div>
  );
}