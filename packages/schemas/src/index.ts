/**
 * index — @preflight/schemas public API.
 * Why: wire DTOs, agent outputs, foldStatus (documentation/12).
 */

export type { ApiResponse } from "./api-response.js"
export { apiSuccessSchema, apiErrorSchema, parseApiResponse } from "./api-response.js"

export {
  ChannelSchema,
  RuleKindSchema,
  MachineVerdictSchema,
  PredicateOpSchema,
  BriefFieldSchema,
  DriftKindSchema,
  DriftChangeSchema,
  AssetStatusSchema,
  StatusSchema,
  EvaluationStatusSchema,
  HumanVerdictSchema,
  DecideVerdictSchema,
} from "./enums.js"
export type {
  Channel,
  RuleKind,
  MachineVerdict,
  PredicateOp,
  BriefField,
  DriftKind,
  DriftChange,
  AssetStatus,
  Status,
  EvaluationStatus,
  HumanVerdict,
  DecideVerdict,
} from "./enums.js"

export {
  HashSchema,
  IsoDateTimeSchema,
  SpanSchema,
  PerformanceFigureSchema,
  PredicateSpecSchema,
} from "./primitives.js"
export type { Hash, IsoDateTime, Span, PerformanceFigure, PredicateSpec } from "./primitives.js"

export {
  BrandKitDTOSchema,
  BrandKitVoiceSchema,
  BrandKitTypographySchema,
  BrandKitColorsSchema,
  BrandKitChannelHintSchema,
} from "./brand-kit.js"
export type {
  BrandKitDTO,
  BrandKitVoice,
  BrandKitTypography,
  BrandKitColors,
  BrandKitChannelHint,
} from "./brand-kit.js"

export { StructuredBriefSchema, PutBriefRequestSchema } from "./brief.js"
export type { StructuredBriefInput, PutBriefRequest } from "./brief.js"

export {
  CompileRuleCardDTOSchema,
  LastCompileDTOSchema,
  CampaignDTOSchema,
  ConstraintSetDTOSchema,
  ConstraintSnapshotDTOSchema,
  CreateCampaignRequestSchema,
  ExtractRequestSchema,
  CompileRequestSchema,
  GenerateRequestSchema,
  CompileResponseDTOSchema,
  GenerateResponseItemSchema,
  GenerateResponseDTOSchema,
  LatestCampaignResponseSchema,
} from "./campaign.js"
export type {
  CompileRuleCardDTO,
  LastCompileDTO,
  CampaignDTO,
  ConstraintSetDTO,
  ConstraintSnapshotDTO,
  CreateCampaignRequest,
  ExtractRequest,
  CompileRequest,
  GenerateRequest,
  CompileResponseDTO,
  GenerateResponseItem,
  GenerateResponseDTO,
  LatestCampaignResponse,
} from "./campaign.js"

export {
  FieldOffsetRangeSchema,
  FieldOffsetsSchema,
  AssetDTOSchema,
  AssetListItemDTOSchema,
  AssetsListResponseSchema,
  ExceptionItemDTOSchema,
  LineageDTOSchema,
  AssetDetailDTOSchema,
} from "./asset.js"
export type {
  FieldOffsetRange,
  FieldOffsets,
  AssetDTO,
  AssetListItemDTO,
  AssetsListResponse,
  ExceptionItemDTO,
  LineageDTO,
  AssetDetailDTO,
} from "./asset.js"

export {
  FindingDTOSchema,
  RetryRequestSchema,
  FindingMutationResponseDTOSchema,
} from "./finding.js"
export type { FindingDTO, RetryRequest, FindingMutationResponseDTO } from "./finding.js"

export {
  RuleCatalogRowDTOSchema,
  JudgementRuleDTOSchema,
  RulesListResponseSchema,
  CreateJudgementRuleRequestSchema,
  UpdateJudgementRuleRequestSchema,
} from "./rule.js"
export type {
  RuleCatalogRowDTO,
  JudgementRuleDTO,
  RulesListResponse,
  CreateJudgementRuleRequest,
  UpdateJudgementRuleRequest,
} from "./rule.js"

export { WaiveRequestSchema } from "./waive.js"
export type { WaiveRequest } from "./waive.js"

export { DecideRequestSchema } from "./decide.js"
export type { DecideRequest } from "./decide.js"

export { DriftItemDTOSchema, RerunStripDTOSchema } from "./rerun-strip.js"
export type { DriftItemDTO, RerunStripDTO } from "./rerun-strip.js"

export { foldStatus, FoldFindingSchema, StatusSchema as FoldStatusSchema } from "./fold-status.js"
export type { FoldFinding } from "./fold-status.js"

export { ExtractorOutputSchema } from "./extractor-output.js"
export type { ExtractorOutput } from "./extractor-output.js"

export { GeneratorOutputSchema } from "./generator-output.js"
export type { GeneratorOutput } from "./generator-output.js"

export { JudgeOutputSchema } from "./judge-output.js"
export type { JudgeOutput } from "./judge-output.js"

export {
  ExplainerOutputSchema,
  ExplainerBriefDraftSchema,
  ExplainerSuggestedActionSchema,
  coerceExplainerOutput,
} from "./explainer-output.js"
export type {
  ExplainerOutput,
  ExplainerBriefDraft,
  ExplainerSuggestedAction,
} from "./explainer-output.js"

export {
  WorkbenchChatRequestSchema,
  WorkbenchChatResponseSchema,
  WorkbenchChatHistoryItemSchema,
} from "./workbench.js"
export type {
  WorkbenchChatRequest,
  WorkbenchChatResponse,
  WorkbenchChatHistoryItem,
} from "./workbench.js"
