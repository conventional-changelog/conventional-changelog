declare module 'better-than-before' {
  export default function BetterThanBefore(): {
    setups(steps: ((context: Record<string, string>) => void)[]): void
    preparing(step: number): Record<string, string>
    tearsWithJoy(fn: () => void): void
  }
}
