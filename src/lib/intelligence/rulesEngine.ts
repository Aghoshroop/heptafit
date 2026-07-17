export interface RuleContext {
  readiness?: number;
  sleep?: number;
  attendance?: number;
  daysToCompetition?: number;
  workloadIncrease?: number;
  [key: string]: any;
}

export interface RuleResult {
  triggered: boolean;
  message: string;
  level: "info" | "warning" | "critical";
  category: "recovery" | "workload" | "attendance" | "competition" | "general";
}

export type RuleCondition = (context: RuleContext) => boolean;

export interface Rule {
  id: string;
  name: string;
  evaluate: RuleCondition;
  result: (context: RuleContext) => RuleResult;
}

export const RulesEngine = {
  rules: [] as Rule[],

  registerRule(rule: Rule) {
    if (!this.rules.find(r => r.id === rule.id)) {
      this.rules.push(rule);
    }
  },

  evaluateAll(context: RuleContext): RuleResult[] {
    return this.rules
      .filter(rule => rule.evaluate(context))
      .map(rule => rule.result(context));
  }
};

// --- DEFAULT RULES BASE ---

RulesEngine.registerRule({
  id: "recovery-recommended",
  name: "Recovery Recommended",
  evaluate: (ctx) => (ctx.readiness ?? 100) < 60 && (ctx.sleep ?? 10) < 6,
  result: (ctx) => ({
    triggered: true,
    message: `Recovery Recommended (Readiness: ${ctx.readiness}%, Sleep: ${ctx.sleep}h)`,
    level: "warning",
    category: "recovery"
  })
});

RulesEngine.registerRule({
  id: "coach-attention-required",
  name: "Coach Attention Required",
  evaluate: (ctx) => (ctx.attendance ?? 100) < 80 && (ctx.daysToCompetition ?? 100) < 14,
  result: (ctx) => ({
    triggered: true,
    message: `Attention Required: Attendance dropped below 80% close to competition`,
    level: "critical",
    category: "attendance"
  })
});

RulesEngine.registerRule({
  id: "overload-warning",
  name: "Overload Warning",
  evaluate: (ctx) => (ctx.workloadIncrease ?? 0) > 30,
  result: (ctx) => ({
    triggered: true,
    message: `Overload Warning: Weekly workload increased by ${ctx.workloadIncrease}%`,
    level: "warning",
    category: "workload"
  })
});
