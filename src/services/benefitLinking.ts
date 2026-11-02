/** Offline fiction only. This API accepts program choices, never personal/card data. */
export const programs = ['SNAP / EBT', 'WIC', 'TANF'] as const;
export type Program = typeof programs[number];
export type AuthorizationScenario = 'approved' | 'declined' | 'cancelled';
export type DemoCard = {program: Program; id: string; label: string};
export type LinkResult = {status: AuthorizationScenario; message: string; card?: DemoCard};
export async function authorizeFictionalCard(program: Program, scenario: AuthorizationScenario): Promise<LinkResult> {
  if (!programs.includes(program) || !['approved', 'declined', 'cancelled'].includes(scenario)) {
    throw new Error('Only predefined fictional programs and responses are supported.');
  }
  if (scenario !== 'approved') return {status: scenario, message: `Simulated ${scenario}: no card linked.`};
  return {status: 'approved', message: `Simulated approval: ${program} fictional card linked.`,
    card: {program, id: `DEMO-${programs.indexOf(program) + 1}`, label: `${program} · Fictional account`}};
}
