/**
 * injection-guard — pre-agent jailbreak / override signal detection.
 * Why: G-05 governance log on untrusted operator text (doc 21).
 */

export type InjectionSeverity = "low" | "medium" | "high";

export interface InjectionDetection {
  signals: string[];
  severity: InjectionSeverity;
}

export const EMPTY_INJECTION: InjectionDetection = {
  signals: [],
  severity: "low",
};

interface SignalRule {
  id: string;
  severity: InjectionSeverity;
  pattern: RegExp;
}

const SIGNAL_RULES: SignalRule[] = [
  {
    id: "ignore_instructions",
    severity: "high",
    pattern:
      /\bignore\s+(?:previous|all|these|the)\s+(?:instructions?|rules?|guidelines?)\b/i,
  },
  {
    id: "jailbreak_role",
    severity: "high",
    pattern:
      /\b(?:you\s+are\s+now|do\s+anything\s+now|\bdan\b|developer\s+mode|jailbreak)\b/i,
  },
  {
    id: "drop_disclaimer",
    severity: "high",
    pattern:
      /\b(?:delete|omit|remove|skip|drop)\b[\s\S]{0,40}\bdisclaimer\b/i,
  },
  {
    id: "ignore_regulator",
    severity: "high",
    pattern: /\bignore\s+(?:sebi|amfi|compliance)\b/i,
  },
  {
    id: "no_restrictions",
    severity: "medium",
    pattern: /\b(?:no|without)\s+(?:restrictions?|limits?|rules?)\b/i,
  },
  {
    id: "override_policy",
    severity: "medium",
    pattern: /\b(?:override|bypass|circumvent)\s+(?:policy|policies|rules?)\b/i,
  },
  {
    id: "instruction_markup",
    severity: "low",
    pattern: /(?:<\s*system\s*>|\[\s*INST\s*\]|<<\s*SYS\s*>>)/i,
  },
  {
    id: "role_system",
    severity: "low",
    pattern: /"role"\s*:\s*"system"/i,
  },
];

const SEVERITY_RANK: Record<InjectionSeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function maxSeverity(
  left: InjectionSeverity,
  right: InjectionSeverity,
): InjectionSeverity {
  return SEVERITY_RANK[right] > SEVERITY_RANK[left] ? right : left;
}

export function detectInjectionSignals(text: string): InjectionDetection {
  const matched = new Set<string>();
  let severity: InjectionSeverity = "low";

  for (const rule of SIGNAL_RULES) {
    if (rule.pattern.test(text)) {
      matched.add(rule.id);
      severity = maxSeverity(severity, rule.severity);
    }
  }

  if (matched.size === 0) {
    return EMPTY_INJECTION;
  }

  return {
    signals: [...matched].sort(),
    severity,
  };
}
