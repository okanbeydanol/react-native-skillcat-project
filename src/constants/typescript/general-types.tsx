export type USER = {
  id: number | null;
};

export enum AppStatus {
  UpdateAvailable = 1,
  Successful = 2,
  WrongVersion = 3,
}

export interface CoreWSError {
  message: string;
  exception?: string;
  errorcode?: string;
}

export type StoreInfoResponse = {
  androidVersion: string;
  iosVersion: string;
  forceUpdate: boolean;
} & CoreWSError;

export interface LearningPlan {
  planid: number;
  plan_completed: boolean;
  has_certificate: boolean;
  plan_has_certificate: boolean;
  total_competencies_completed: string;
  total_course_progress: number;
  total_grade: number;
  competencies_cmids?: string[];
  total_max_grade: number;
  category: string;
  defaultLP: boolean;
  timemodified?: number;
  updateActivities?: boolean;
  plan_type: string;
  description: string;
  shortname: string;
  competencies: LearningPlanCompetencies[];
  certificate_competencies: any[];
  id: number;
  descriptionformat: string;
  average: string;
  average_10: string;
}

export interface LearningPlanCompetencies {
  activities: ActivityDetail[];
  activity_count: number;
  completed_activity_count: number;
  categoryname: string;
  planid: number;
  completed: boolean;
  attempt_status: string;
  grade: string;
  courseid: string;
  modicon?: string;
  description: string;
  completiondata: CompletionData;
  instanceid: number;
  shortname: string;
  competency_shortname: string;
  certificate_image: string;
  quiz_shortname: string;
  time: string;
  progress: number;
  competencyType: CompetencyType;
  id: number;
  modname?: string;
  redirectPageInfo: RedirectPageInfo;
  sectionid: number;
  badgeImageUrl: string;
  idnumber: string;
  badge: string;
  badgeSafe: string;
  cmids: string;
  assign_cmid?: number;
  quiz_cmid?: number;
  proctoring: number;
  sortorder: number;
  status: string;
  total_competencies_completed: string;
  total_course_progress: number;
  total_grade: number;
  total_max_grade: number;
  category: string;
  scaleconfiguration: string;
  scaleid: number;
  timecreated: number;
  timemodified: number;
  usermodified: number;
  competencyid: string;
  tags: CompetencyTag[];
  greenBadge: boolean;
  competencyframework: string;
  descriptionformat: string;
  ruletype: string;
  activities_cmids?: string[];
  ruleconfig: string;
  parentid: string;
  path: string;
  ruleoutcome: string;
  competencyframeworkid: string;
  active: boolean;
}

export interface CompetencyTag {
  cmid: number;
  instanceid: number;
  intro: string;
  intro_images: string[];
  module_name: string;
  name: string;
  quiz_cmid?: number;
  assign_cmid?: number;
  competencyid?: number;
  timemodified?: number;
}

export interface RedirectPageInfo {
  name: string;
  slideAttribute?: string;
  competencyid?: number;
  quiz_cmid?: number;
  timemodified?: number;
  type: RedirectPageInfoType;
}
export enum RedirectPageInfoType {
  page = 'page',
  tab = 'tab',
}
export interface CompletionStatusDetail {
  state: number;
  timecompleted: number;
  tracking: number;
  uservisible: boolean;
  valueused: boolean;
}

export interface ModuleCompletionStatus {
  cmid: number;
  hascompletion: boolean;
  instance: number;
  isautomatic: boolean;
  istrackeduser: boolean;
  modname: string;
  state: number;
  timecompleted: number;
  tracking: number;
  completed: boolean;
  valueused: boolean;
  uservisible: boolean;
}

export interface ActivityCompletionStatus {
  courseid: string;
  completionData: CompletionsStatuses[];
}

export interface CompletionsStatuses {
  attempt_status?: CompetencyStatus;
  completed?: boolean;
  courseid?: number;
  cmid: number;
  final_exam?: boolean;
  grade?: string;
  proctored?: boolean;
}
export enum CompetencyStatus {
  completed = 'completed',
  rejected = 'rejected',
  upload = 'no attempt',
  failed = 'failed attempt',
  pending = 'in progress',
  approved = 'approved',
  inreview = 'in review',
}

export interface CompletionData {
  cmid?: number;
  hascompletion?: boolean;
  instance?: number;
  isautomatic?: boolean;
  istrackeduser?: boolean;
  modname?: string;
  state?: number;
  timecompleted?: number;
  tracking?: number;
  completed?: boolean;
  valueused?: boolean;
  uservisible?: boolean;
}

export interface CompletionContentDetail {
  author: string;
  filename: string;
  fileurl: string;
  timecreated: number;
  timemodified: number;
}

export interface ActivityDetail {
  hiddenbynumsections: number;
  id: number;
  name: string;
  cmids: string;
  summary: string;
  badgeSafe?: string;
  section: number;
  summaryformat: number;
  completed: boolean;
  uservisible: number;
  courseid?: number;
  visible: number;
  sortorder: number;
  modules: ModulesDetail[];
  indent: number;
  instance: number;
  modicon: string;
  modname: string;
  competencyType: CompetencyType;
  modplural: string;
  shortname?: string;
  quiz_shortname?: string;
  competency_shortname?: string;
  certificate_image?: string;
  attempt_status?: string;
  categoryname?: string;
  sectionName?: string;
  sectionTime?: string;
  sectionid?: number;
  grade?: number;
  time?: string;
  badgeImageUrl: string;
  quiz_cmid?: number;
  assign_cmid?: number;
  greenBadge: string;
  progress: number;
  description: string;
  active?: boolean;
  visibleoncoursepage: number;
  url: string;
  completionstatus: CompletionStatusDetail;
  completiondata: ModuleCompletionStatus;
  completion: number;
  contents: CompletionContentDetail[];
  contextid: number;
  proctoring: number;
  isStealth: number;
  noviewlink: boolean;
  onclick: string;
  availability: string;
  timemodified?: number;
}

export enum ChangeToAnimation {
  forward = 'forward',
  backward = 'backward',
}

export enum CompetencyType {
  offlineActivities = 'offlineActivities',
  tradeSchoolActivities = 'tradeSchoolActivities',
}

export interface ModulesDetail {
  id: number;
  indent: number;
  instance: number;
  modicon: string;
  modname: string;
  modplural: string;
  name: string;
  completed: boolean;
  progress: number;
  summary?: string;
  description: string;
  visibleoncoursepage: number;
  attempt_status: string;
  courseid: number;
  grade: string;
  categoryname: string;
  competencyType: CompetencyType;
  time?: string;
  shortname: string;
  competencyid: string;
  cmids: string;
  quiz_cmid?: number;
  visible: number;
  uservisible: boolean;
  url: string;
  completionstatus: CompletionStatusDetail;
  completiondata: ModuleCompletionStatus;
  completion: number;
  contents: CompletionContentDetail[];
  contextid: number;
  sectionid: number;
  proctoring: number;
  isStealth: number;
  badgeImageUrl: string;
  badgeSafe: string;
  noviewlink: boolean;
  onclick: string;
  availability: string;
  timemodified?: number;
}

export interface UserGoal {
  goal: string;
  description: string;
  congratulations: string;
}

export interface LearningPlanCompletedLocalStorageData {
  planid: number;
  completedTime: string;
  userResponded: boolean;
}

export type AddonModAssignSaveSubmissionWSParams = {
  assignmentid: number;
  plugindata: any;
};

export interface SearchResult {
  id: number;
  name: string;
  type: SearchResultType;
}

export enum SearchResultType {
  lp = 'lp',
  competency = 'competency',
}
