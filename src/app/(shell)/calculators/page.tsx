'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';
import {
  Award,
  Calculator,
  CheckCircle2,
  Equal,
} from 'lucide-react';

type CalcType =
  | 'basic'
  | 'scientific'
  | 'percentage'
  | 'gpa'
  | 'cgpa'
  | 'attendance'
  | 'marks'
  | 'grade'
  | 'age'
  | 'date-diff'
  | 'bmi'
  | 'discount'
  | 'simple-interest'
  | 'compound-interest'
  | 'fraction'
  | 'ratio';

const calcCategories: {
  type: CalcType;
  label: string;
  icon: typeof Calculator;
}[] = [
  { type: 'basic', label: 'Basic', icon: Calculator },
  { type: 'scientific', label: 'Scientific', icon: Calculator },
  { type: 'percentage', label: 'Percentage', icon: Calculator },
  { type: 'gpa', label: 'GPA', icon: Award },
  { type: 'cgpa', label: 'CGPA', icon: Award },
  { type: 'attendance', label: 'Attendance', icon: Calculator },
  { type: 'marks', label: 'Marks', icon: Calculator },
  { type: 'grade', label: 'Grade', icon: Award },
  { type: 'age', label: 'Age', icon: Calculator },
  { type: 'date-diff', label: 'Date Diff', icon: Calculator },
  { type: 'bmi', label: 'BMI', icon: Calculator },
  { type: 'discount', label: 'Discount', icon: Calculator },
  {
    type: 'simple-interest',
    label: 'Simple Interest',
    icon: Calculator,
  },
  {
    type: 'compound-interest',
    label: 'Compound Interest',
    icon: Calculator,
  },
  { type: 'fraction', label: 'Fraction', icon: Calculator },
  { type: 'ratio', label: 'Ratio', icon: Calculator },
];

type BasicHistory = {
  expression: string;
  result: string;
};

type GradeResult = {
  grade: string;
  point: number;
};

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x || 1;
}

function calculateGrade(
  marks: number,
  total: number,
): GradeResult | null {
  if (total <= 0 || marks < 0) {
    return null;
  }

  const percentage = (marks / total) * 100;

  if (percentage >= 90) return { grade: 'A+', point: 4.0 };
  if (percentage >= 80) return { grade: 'A', point: 4.0 };
  if (percentage >= 70) return { grade: 'B+', point: 3.3 };
  if (percentage >= 60) return { grade: 'B', point: 3.0 };
  if (percentage >= 50) return { grade: 'C', point: 2.0 };
  if (percentage >= 40) return { grade: 'D', point: 1.0 };

  return { grade: 'F', point: 0 };
}

function evaluateScientificExpression(
  expression: string,
): number {
  if (!expression.trim()) {
    throw new Error('Empty expression');
  }

  const normalized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/\blog\(/g, 'Math.log10(')
    .replace(/\bln\(/g, 'Math.log(')
    .replace(/\bsin\(/g, 'Math.sin(')
    .replace(/\bcos\(/g, 'Math.cos(')
    .replace(/\btan\(/g, 'Math.tan(')
    .replace(/(\d+(?:\.\d+)?)²/g, '($1**2)')
    .replace(/(\d+(?:\.\d+)?)³/g, '($1**3)')
    .replace(
      /(\d+(?:\.\d+)?)!/g,
      'factorial($1)',
    );

  /*
   * This calculator accepts only arithmetic characters,
   * Math functions and factorial notation.
   */
  if (
    !/^[0-9+\-*/%().,\sA-Za-z_]+$/.test(
      normalized,
    )
  ) {
    throw new Error('Invalid expression');
  }

  const factorial = (value: number): number => {
    if (!Number.isInteger(value) || value < 0 || value > 170) {
      throw new Error('Invalid factorial');
    }

    let result = 1;

    for (let i = 2; i <= value; i += 1) {
      result *= i;
    }

    return result;
  };

  /*
   * Keep the evaluator scoped to the supported calculator
   * operations instead of exposing arbitrary global objects.
   */
  const evaluator = new Function(
    'Math',
    'factorial',
    `"use strict"; return (${normalized});`,
  );

  const result = evaluator(Math, factorial);

  if (
    typeof result !== 'number' ||
    !Number.isFinite(result)
  ) {
    throw new Error('Invalid result');
  }

  return result;
}

export default function CalculatorsPage() {
  const [activeCalc, setActiveCalc] =
    useState<CalcType>('basic');

  /* Basic calculator */
  const [expression, setExpression] = useState('');
  const [basicResult, setBasicResult] = useState('0');
  const [history, setHistory] = useState<BasicHistory[]>([]);

  /* Scientific calculator */
  const [scientificExpression, setScientificExpression] =
    useState('');
  const [scientificResult, setScientificResult] =
    useState('0');

  /* Percentage */
  const [percentageInput, setPercentageInput] = useState({
    value: 0,
    total: 0,
  });

  /* Attendance */
  const [attendanceInput, setAttendanceInput] =
    useState({
      attended: 0,
      total: 0,
      target: 75,
    });

  /* Marks */
  const [marksInput, setMarksInput] = useState({
    obtained: 0,
    total: 100,
  });

  /* Grade */
  const [gradeInput, setGradeInput] = useState({
    obtained: 0,
    total: 100,
  });

  /* Age */
  const [birthDate, setBirthDate] = useState('');

  /* Date difference */
  const [dateDiffInput, setDateDiffInput] =
    useState({
      start: '',
      end: '',
    });

  /* BMI */
  const [bmiInput, setBmiInput] = useState({
    weight: 0,
    height: 0,
  });

  /* Discount */
  const [discountInput, setDiscountInput] =
    useState({
      original: 0,
      discounted: 0,
    });

  /* Simple interest */
  const [simpleInterestInput, setSimpleInterestInput] =
    useState({
      principal: 0,
      rate: 0,
      time: 0,
    });

  /* Compound interest */
  const [compoundInterestInput, setCompoundInterestInput] =
    useState({
      principal: 0,
      rate: 0,
      time: 0,
      compounds: 1,
    });

  /* Fraction */
  const [fractionInput, setFractionInput] =
    useState({
      numerator: 0,
      denominator: 1,
    });

  /* Ratio */
  const [ratioInput, setRatioInput] =
    useState({
      a: 0,
      b: 0,
    });

  const activeCategory = calcCategories.find(
    (category) => category.type === activeCalc,
  );

  const handleBasicClick = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setBasicResult('0');
      return;
    }

    if (value === '⌫') {
      setExpression((current) => current.slice(0, -1));
      return;
    }

    if (value === '±') {
      setExpression((current) => {
        if (!current) return current;

        return current.startsWith('-')
          ? current.slice(1)
          : `-${current}`;
      });

      return;
    }

    if (value === '=') {
      if (!expression.trim()) {
        return;
      }

      try {
        const calculated =
          evaluateScientificExpression(expression);

        const resultString = String(
          Number(calculated.toFixed(8)),
        );

        setBasicResult(resultString);
        setExpression(resultString);

        setHistory((current) => [
          ...current.slice(-9),
          {
            expression,
            result: resultString,
          },
        ]);
      } catch {
        setBasicResult('Error');
      }

      return;
    }

    setExpression((current) => `${current}${value}`);
  };

  const handleScientificClick = (value: string) => {
    if (value === 'C') {
      setScientificExpression('');
      setScientificResult('0');
      return;
    }

    if (value === '⌫') {
      setScientificExpression((current) =>
        current.slice(0, -1),
      );
      return;
    }

    if (value === '=') {
      if (!scientificExpression.trim()) {
        return;
      }

      try {
        const result =
          evaluateScientificExpression(
            scientificExpression,
          );

        setScientificResult(
          String(Number(result.toFixed(8))),
        );
      } catch {
        setScientificResult('Error');
      }

      return;
    }

    const functionNames = [
      'sin',
      'cos',
      'tan',
      'log',
      'ln',
      '√',
    ];

    if (functionNames.includes(value)) {
      setScientificExpression(
        (current) => `${current}${value}(`,
      );
      return;
    }

    if (value === 'π' || value === 'e') {
      setScientificExpression(
        (current) => `${current}${value}`,
      );
      return;
    }

    if (value === 'x²') {
      setScientificExpression(
        (current) => `${current}²`,
      );
      return;
    }

    if (value === 'x³') {
      setScientificExpression(
        (current) => `${current}³`,
      );
      return;
    }

    if (value === '1/x') {
      setScientificExpression(
        (current) => `1/(${current || '0'})`,
      );
      return;
    }

    if (value === 'n!') {
      setScientificExpression(
        (current) => `${current}!`,
      );
      return;
    }

    setScientificExpression(
      (current) => `${current}${value}`,
    );
  };

  const scientificButtons = [
    'sin',
    'cos',
    'tan',
    'log',
    'ln',
    '√',
    'x²',
    'x³',
    '1/x',
    'n!',
    'π',
    'e',
  ];

  const calculatePercentage =
    percentageInput.total > 0
      ? (percentageInput.value / 100) *
        percentageInput.total
      : 0;

  const attendanceRate =
    attendanceInput.total > 0
      ? (attendanceInput.attended /
          attendanceInput.total) *
        100
      : 0;

  const classesNeeded =
    attendanceInput.target > 0 &&
    attendanceInput.target <= 100 &&
    attendanceInput.attended >= 0 &&
    attendanceInput.total >= attendanceInput.attended
      ? Math.max(
          0,
          Math.ceil(
            (attendanceInput.target *
              attendanceInput.total -
              100 * attendanceInput.attended) /
              (100 - attendanceInput.target),
          ),
        )
      : 0;

  const marksPercentage =
    marksInput.total > 0
      ? (marksInput.obtained /
          marksInput.total) *
        100
      : 0;

  const gradeResult = calculateGrade(
    gradeInput.obtained,
    gradeInput.total,
  );

  const calculateAge = () => {
    if (!birthDate) return null;

    const birth = new Date(
      `${birthDate}T00:00:00`,
    );

    if (Number.isNaN(birth.getTime())) {
      return null;
    }

    const today = new Date();

    if (birth > today) {
      return null;
    }

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age -= 1;
    }

    return age;
  };

  const calculateDateDifference = () => {
    if (
      !dateDiffInput.start ||
      !dateDiffInput.end
    ) {
      return null;
    }

    const start = new Date(
      `${dateDiffInput.start}T00:00:00`,
    );

    const end = new Date(
      `${dateDiffInput.end}T00:00:00`,
    );

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return null;
    }

    const diffMs =
      end.getTime() - start.getTime();

    if (diffMs < 0) {
      return null;
    }

    const days = Math.floor(
      diffMs / 86_400_000,
    );

    return {
      days,
      totalDays: Math.ceil(
        diffMs / 86_400_000,
      ),
    };
  };

  const bmi =
    bmiInput.weight > 0 &&
    bmiInput.height > 0
      ? bmiInput.weight /
        Math.pow(
          bmiInput.height / 100,
          2,
        )
      : 0;

  const bmiCategory =
    bmi <= 0
      ? null
      : bmi < 18.5
        ? 'Underweight'
        : bmi < 25
          ? 'Normal'
          : bmi < 30
            ? 'Overweight'
            : 'Obese';

  const discountPercentage =
    discountInput.original > 0
      ? ((discountInput.original -
          discountInput.discounted) /
          discountInput.original) *
        100
      : 0;

  const simpleInterest =
    simpleInterestInput.principal > 0 &&
    simpleInterestInput.rate >= 0 &&
    simpleInterestInput.time >= 0
      ? (simpleInterestInput.principal *
          simpleInterestInput.rate *
          simpleInterestInput.time) /
        100
      : 0;

  const compoundAmount =
    compoundInterestInput.principal > 0 &&
    compoundInterestInput.rate >= 0 &&
    compoundInterestInput.time >= 0 &&
    compoundInterestInput.compounds > 0
      ? compoundInterestInput.principal *
        Math.pow(
          1 +
            compoundInterestInput.rate /
              (100 *
                compoundInterestInput.compounds),
          compoundInterestInput.compounds *
            compoundInterestInput.time,
        )
      : 0;

  const fractionResult =
    fractionInput.denominator !== 0
      ? (() => {
          const divisor = gcd(
            fractionInput.numerator,
            fractionInput.denominator,
          );

          return {
            decimal:
              fractionInput.numerator /
              fractionInput.denominator,
            simplified: `${fractionInput.numerator / divisor}/${fractionInput.denominator / divisor}`,
          };
        })()
      : null;

  const ratioResult =
    ratioInput.b !== 0
      ? (() => {
          const divisor = gcd(
            ratioInput.a,
            ratioInput.b,
          );

          return `${ratioInput.a / divisor}:${ratioInput.b / divisor}`;
        })()
      : null;

  const renderCalculator = () => {
    switch (activeCalc) {
      case 'basic':
        return (
          <div className="flex w-full max-w-sm flex-col items-center gap-4">
            <div className="w-full">
              <div className="min-h-[80px] break-all rounded-lg bg-muted p-4 text-right font-mono text-2xl">
                {expression || '0'}
              </div>

              <div className="min-h-[56px] rounded-lg bg-background p-4 text-right font-mono text-3xl font-bold">
                {basicResult}
              </div>
            </div>

            <div className="grid w-full grid-cols-4 gap-2">
              {[
                '7',
                '8',
                '9',
                '÷',
                '4',
                '5',
                '6',
                '×',
                '1',
                '2',
                '3',
                '-',
                '0',
                '.',
                'C',
                '+',
                'π',
                '±',
                '⌫',
                '=',
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    handleBasicClick(key)
                  }
                  className={cn(
                    'h-14 rounded-lg font-mono text-lg transition-colors',
                    key === 'C' ||
                      key === '⌫'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : [
                            '÷',
                            '×',
                            '-',
                            '+',
                            '=',
                          ].includes(key)
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-foreground hover:bg-muted/80',
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <div className="max-h-32 w-full space-y-1 overflow-y-auto">
                {history
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={`${item.expression}-${index}`}
                      className="truncate text-xs text-muted-foreground"
                    >
                      <span className="text-muted-foreground/50">
                        {item.expression}
                      </span>{' '}
                      ={' '}
                      <span className="font-medium">
                        {item.result}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );

      case 'scientific':
        return (
          <div className="flex w-full max-w-sm flex-col items-center gap-4">
            <div className="w-full">
              <div className="min-h-[60px] break-all rounded-lg bg-muted p-4 text-right font-mono text-xl">
                {scientificExpression ||
                  '0'}
              </div>

              <div className="min-h-[48px] rounded-lg bg-background p-4 text-right font-mono text-2xl font-bold">
                {scientificResult}
              </div>
            </div>

            <div className="grid w-full grid-cols-4 gap-2">
              {scientificButtons.map(
                (button) => (
                  <button
                    key={button}
                    type="button"
                    onClick={() =>
                      handleScientificClick(
                        button,
                      )
                    }
                    className="h-9 rounded bg-muted px-2 text-xs font-mono font-medium transition-colors hover:bg-muted/80"
                  >
                    {button}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  handleScientificClick('C')
                }
                className="h-9 rounded bg-red-100 px-2 text-xs font-medium text-red-700 hover:bg-red-200"
              >
                C
              </button>

              <button
                type="button"
                onClick={() =>
                  handleScientificClick('⌫')
                }
                className="h-9 rounded bg-muted px-2 text-xs font-medium hover:bg-muted/80"
              >
                ⌫
              </button>

              <button
                type="button"
                onClick={() =>
                  handleScientificClick('=')
                }
                className="h-9 rounded bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                =
              </button>
            </div>

            <div className="grid w-full grid-cols-4 gap-2">
              {[
                '7',
                '8',
                '9',
                '÷',
                '4',
                '5',
                '6',
                '×',
                '1',
                '2',
                '3',
                '-',
                '0',
                '.',
                '(',
                ')',
                '+',
              ].map((button) => (
                <button
                  key={button}
                  type="button"
                  onClick={() =>
                    handleScientificClick(
                      button,
                    )
                  }
                  className="h-10 rounded bg-muted font-mono text-sm hover:bg-muted/80"
                >
                  {button}
                </button>
              ))}
            </div>
          </div>
        );

      case 'percentage':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Percentage (%)"
                value={percentageInput.value}
                onChange={(event) =>
                  setPercentageInput(
                    (current) => ({
                      ...current,
                      value: parseNumber(
                        event.target.value,
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Total"
                value={percentageInput.total}
                onChange={(event) =>
                  setPercentageInput(
                    (current) => ({
                      ...current,
                      total: parseNumber(
                        event.target.value,
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {calculatePercentage.toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">
                {percentageInput.value}% of{' '}
                {percentageInput.total}
              </p>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                label="Attended"
                min={0}
                value={attendanceInput.attended}
                onChange={(event) =>
                  setAttendanceInput(
                    (current) => ({
                      ...current,
                      attended: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Total Classes"
                min={0}
                value={attendanceInput.total}
                onChange={(event) =>
                  setAttendanceInput(
                    (current) => ({
                      ...current,
                      total: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Target %"
                min={1}
                max={100}
                value={attendanceInput.target}
                onChange={(event) =>
                  setAttendanceInput(
                    (current) => ({
                      ...current,
                      target: Math.min(
                        100,
                        Math.max(
                          1,
                          parseNumber(
                            event.target.value,
                          ),
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <Card className="border-green-200/50 bg-green-50/50 dark:border-green-800/30 dark:bg-green-950/20">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {attendanceRate.toFixed(1)}%
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Current attendance
                  </p>

                  {attendanceInput.total > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {attendanceInput.attended}/
                      {attendanceInput.total} classes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg bg-muted p-3 text-center text-sm">
              <p className="font-medium">
                Target: {attendanceInput.target}%
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {attendanceRate >=
                attendanceInput.target
                  ? 'Target achieved'
                  : `Need approximately ${classesNeeded} consecutive attended class${classesNeeded === 1 ? '' : 'es'} to reach target`}
              </p>
            </div>
          </div>
        );

      case 'marks':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Marks Obtained"
                min={0}
                value={marksInput.obtained}
                onChange={(event) =>
                  setMarksInput(
                    (current) => ({
                      ...current,
                      obtained: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Total Marks"
                min={1}
                value={marksInput.total}
                onChange={(event) =>
                  setMarksInput(
                    (current) => ({
                      ...current,
                      total: Math.max(
                        1,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {marksPercentage.toFixed(2)}%
                </span>

                {calculateGrade(
                  marksInput.obtained,
                  marksInput.total,
                ) && (
                  <Badge className="text-lg">
                    {
                      calculateGrade(
                        marksInput.obtained,
                        marksInput.total,
                      )?.grade
                    }
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {marksInput.obtained} /{' '}
                {marksInput.total}
              </p>
            </div>
          </div>
        );

      case 'grade':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Marks Obtained"
                min={0}
                value={gradeInput.obtained}
                onChange={(event) =>
                  setGradeInput(
                    (current) => ({
                      ...current,
                      obtained: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Total Marks"
                min={1}
                value={gradeInput.total}
                onChange={(event) =>
                  setGradeInput(
                    (current) => ({
                      ...current,
                      total: Math.max(
                        1,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-2 text-sm text-muted-foreground">
                  Grade
                </p>

                {gradeResult ? (
                  <>
                    <p className="text-4xl font-bold text-primary">
                      {gradeResult.grade}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Grade Point:{' '}
                      {gradeResult.point.toFixed(
                        1,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {(
                        (gradeInput.obtained /
                          gradeInput.total) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </>
                ) : (
                  <p className="text-3xl">—</p>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'age': {
        const age = calculateAge();

        return (
          <div className="w-full max-w-sm space-y-4">
            <Input
              type="date"
              label="Date of Birth"
              value={birthDate}
              max={
                new Date()
                  .toISOString()
                  .split('T')[0]
              }
              onChange={(event) =>
                setBirthDate(
                  event.target.value,
                )
              }
            />

            <div className="py-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {age === null ? '—' : age}
              </p>

              <p className="text-sm text-muted-foreground">
                {age === null
                  ? 'Enter a valid date of birth'
                  : 'years old'}
              </p>
            </div>
          </div>
        );
      }

      case 'date-diff': {
        const difference =
          calculateDateDifference();

        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Start Date"
                value={dateDiffInput.start}
                onChange={(event) =>
                  setDateDiffInput(
                    (current) => ({
                      ...current,
                      start: event.target.value,
                    }),
                  )
                }
              />

              <Input
                type="date"
                label="End Date"
                value={dateDiffInput.end}
                onChange={(event) =>
                  setDateDiffInput(
                    (current) => ({
                      ...current,
                      end: event.target.value,
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              {difference ? (
                <>
                  <p className="text-3xl font-bold text-primary">
                    {difference.days}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    days
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter a valid date range
                </p>
              )}
            </div>
          </div>
        );
      }

      case 'bmi':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Weight (kg)"
                min={0}
                value={bmiInput.weight}
                onChange={(event) =>
                  setBmiInput(
                    (current) => ({
                      ...current,
                      weight: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Height (cm)"
                min={0}
                value={bmiInput.height}
                onChange={(event) =>
                  setBmiInput(
                    (current) => ({
                      ...current,
                      height: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              {bmi > 0 && bmiCategory ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {bmi.toFixed(1)}
                    </span>

                    <Badge>{bmiCategory}</Badge>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    BMI = weight(kg) /
                    height(m)²
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter weight and height
                </p>
              )}
            </div>
          </div>
        );

      case 'discount':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Original Price"
                min={0}
                value={discountInput.original}
                onChange={(event) =>
                  setDiscountInput(
                    (current) => ({
                      ...current,
                      original: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Discounted Price"
                min={0}
                value={discountInput.discounted}
                onChange={(event) =>
                  setDiscountInput(
                    (current) => ({
                      ...current,
                      discounted: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              {discountInput.original > 0 ? (
                <>
                  <p className="text-3xl font-bold text-primary">
                    {discountPercentage.toFixed(
                      2,
                    )}
                    %
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Discount percentage
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Saved: ₹
                    {(
                      discountInput.original -
                      discountInput.discounted
                    ).toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter the original price
                </p>
              )}
            </div>
          </div>
        );

      case 'simple-interest':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                label="Principal"
                min={0}
                value={
                  simpleInterestInput.principal
                }
                onChange={(event) =>
                  setSimpleInterestInput(
                    (current) => ({
                      ...current,
                      principal: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Rate (%)"
                min={0}
                value={
                  simpleInterestInput.rate
                }
                onChange={(event) =>
                  setSimpleInterestInput(
                    (current) => ({
                      ...current,
                      rate: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Time (years)"
                min={0}
                value={
                  simpleInterestInput.time
                }
                onChange={(event) =>
                  setSimpleInterestInput(
                    (current) => ({
                      ...current,
                      time: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              <p className="text-2xl font-bold text-primary">
                ₹{simpleInterest.toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">
                Simple Interest
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Total: ₹
                {(
                  simpleInterestInput.principal +
                  simpleInterest
                ).toFixed(2)}
              </p>
            </div>
          </div>
        );

      case 'compound-interest': {
        const compoundInterest =
          Math.max(
            0,
            compoundAmount -
              compoundInterestInput.principal,
          );

        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Input
                type="number"
                label="Principal"
                min={0}
                value={
                  compoundInterestInput.principal
                }
                onChange={(event) =>
                  setCompoundInterestInput(
                    (current) => ({
                      ...current,
                      principal: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Rate (%)"
                min={0}
                value={
                  compoundInterestInput.rate
                }
                onChange={(event) =>
                  setCompoundInterestInput(
                    (current) => ({
                      ...current,
                      rate: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Time (years)"
                min={0}
                value={
                  compoundInterestInput.time
                }
                onChange={(event) =>
                  setCompoundInterestInput(
                    (current) => ({
                      ...current,
                      time: Math.max(
                        0,
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
              />

              <Input
                type="number"
                label="Compounds/yr"
                min={1}
                value={
                  compoundInterestInput.compounds
                }
                onChange={(event) =>
                  setCompoundInterestInput(
                    (current) => ({
                      ...current,
                      compounds: Math.max(
                        1,
                        Math.trunc(
                          parseNumber(
                            event.target.value,
                          ),
                        ),
                      ),
                    }),
                  )
                }
              />
            </div>

            <div className="py-4 text-center">
              <p className="text-2xl font-bold text-primary">
                ₹{compoundInterest.toFixed(2)}
              </p>

              <p className="text-sm text-muted-foreground">
                Compound Interest
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Total: ₹
                {compoundAmount.toFixed(2)}
              </p>
            </div>
          </div>
        );
      }

      case 'fraction':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-end justify-center gap-2">
              <Input
                type="number"
                label="Numerator"
                value={
                  fractionInput.numerator
                }
                onChange={(event) =>
                  setFractionInput(
                    (current) => ({
                      ...current,
                      numerator: Math.trunc(
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
                className="w-28"
              />

              <span className="pb-2 text-xl font-bold">
                /
              </span>

              <Input
                type="number"
                label="Denominator"
                value={
                  fractionInput.denominator
                }
                onChange={(event) =>
                  setFractionInput(
                    (current) => ({
                      ...current,
                      denominator: Math.trunc(
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
                className="w-28"
              />
            </div>

            <div className="py-4 text-center">
              {fractionResult ? (
                <>
                  <p className="text-3xl font-bold text-primary">
                    {fractionResult.decimal.toFixed(
                      4,
                    )}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    = {fractionResult.simplified}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600">
                  Denominator cannot be zero
                </p>
              )}
            </div>
          </div>
        );

      case 'ratio':
        return (
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-end justify-center gap-2">
              <Input
                type="number"
                label="A"
                value={ratioInput.a}
                onChange={(event) =>
                  setRatioInput(
                    (current) => ({
                      ...current,
                      a: Math.trunc(
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
                className="w-28"
              />

              <span className="pb-2 text-xl font-bold">
                :
              </span>

              <Input
                type="number"
                label="B"
                value={ratioInput.b}
                onChange={(event) =>
                  setRatioInput(
                    (current) => ({
                      ...current,
                      b: Math.trunc(
                        parseNumber(
                          event.target.value,
                        ),
                      ),
                    }),
                  )
                }
                className="w-28"
              />
            </div>

            <div className="py-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {ratioResult ?? 'Undefined'}
              </p>

              <p className="text-sm text-muted-foreground">
                Simplified ratio
              </p>
            </div>
          </div>
        );

      case 'gpa':
        return (
          <div className="max-w-sm text-center">
            <p className="text-sm text-muted-foreground">
              GPA calculator
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Subject-wise credits and grade points
              will be added when the GPA module is
              connected to the shared calculator data.
            </p>
          </div>
        );

      case 'cgpa':
        return (
          <div className="max-w-sm text-center">
            <p className="text-sm text-muted-foreground">
              CGPA calculator
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              CGPA calculation will use semester GPA
              data once the academic module is
              connected.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-muted-foreground">
            Calculator loading...
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Calculators
          </h1>

          <p className="text-sm text-muted-foreground">
            All your calculation needs in one place
          </p>
        </div>
      </div>

      {/* Main Calculator Area */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden lg:flex-row">
        {/* Calculator Navigation */}
        <Card className="w-full shrink-0 overflow-y-auto lg:w-52">
          <CardContent className="p-2">
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {calcCategories.map(
                (category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.type}
                      type="button"
                      onClick={() =>
                        setActiveCalc(
                          category.type,
                        )
                      }
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
                        activeCalc ===
                          category.type
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted/50',
                      )}
                    >
                      <Icon
                        size={16}
                        aria-hidden="true"
                        className={
                          activeCalc ===
                          category.type
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }
                      />

                      <span className="text-xs font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calculator Content */}
        <Card className="min-h-0 flex-1 overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {activeCategory?.label} Calculator
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              {activeCategory?.label} — Use the
              controls below
            </p>
          </CardHeader>

          <CardContent className="flex min-h-[300px] items-center justify-center p-6">
            {renderCalculator()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}