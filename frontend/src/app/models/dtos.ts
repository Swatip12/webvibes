export interface InternshipApplicationDTO {
  id?: number;
  studentName: string;
  email: string;
  phone: string;
  internshipType: string;
  message?: string;
  submittedAt?: string;
}

export interface CourseEnrollmentDTO {
  id?: number;
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  message?: string;
  submittedAt?: string;
}

export interface ContactMessageDTO {
  id?: number;
  name: string;
  email: string;
  message: string;
  submittedAt?: string;
}

export interface ProjectDTO {
  id?: number;
  title: string;
  description: string;
  githubLink: string;
  imageUrl: string;
}

export interface MessageResponse {
  message: string;
}
export interface AdminUser {
  username: string;
  role: string;
}

export interface JwtAuthResponse {
  token: string;
  type: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CourseDTO {
  id?: number;
  name: string;
  description: string;
  duration: number;
  technologies?: string;
  syllabusUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InternshipDTO {
  id?: number;
  type: string;
  description: string;
  duration: number;
  skills?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Student portal DTOs
export interface StudentRegisterRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export interface StudentLoginRequest {
  email: string;
  password: string;
}

export interface StudentAuthResponse {
  token: string;
  name: string;
  role: string;
}

export interface DashboardResponse {
  name: string;
  email: string;
  planAssigned: boolean;
  planName?: string;
  totalFee?: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus?: 'NOT_PAID' | 'PARTIAL' | 'FULL';
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerifyRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  paymentType: string;
}

export interface AdminStudentDTO {
  id: number;
  name: string;
  email: string;
  mobile: string;
  planAssigned: boolean;
  planName?: string;
  totalFee?: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus?: 'NOT_PAID' | 'PARTIAL' | 'FULL';
  utrNumber?: string;
  pendingUtrType?: string;
}

// Assessment portal DTOs
export type AssessmentType = 'MOCK_INTERVIEW' | 'APTITUDE_TEST' | 'MACHINE_TEST' | 'TECHNICAL_MCQ';
export type AssessmentStatus = 'PENDING' | 'UPCOMING' | 'COMPLETED';

export interface StudentAssessmentDTO {
  studentAssessmentId: number;
  assessmentId: number;
  title: string;
  type: AssessmentType;
  status: AssessmentStatus;
  scheduledAt?: string;
  timeLimitMinutes?: number;
  score?: number;
}

export interface AssessmentDetailDTO {
  studentAssessmentId: number;
  assessmentId: number;
  title: string;
  description?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  scheduledAt?: string;
  videoLink?: string;
  problemStatement?: string;
  timeLimitMinutes?: number;
}

export interface QuestionStudentDTO {
  questionId: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface AnswerDTO {
  questionId: number;
  selectedIndex: number;
}

export interface McqSubmitRequest {
  answers: AnswerDTO[];
}

export interface MachineSubmitRequest {
  solutionText: string;
}

export interface SubmitResponse {
  score?: number;
  total?: number;
  status: AssessmentStatus;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  type: AssessmentType;
  scheduledAt?: string;
  videoLink?: string;
  problemStatement?: string;
  timeLimitMinutes?: number;
}

export interface CreateQuestionRequest {
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswerIndex: number;
}

export interface AssignRequest {
  studentIds?: number[];
  batchName?: string;
}

export interface AssignResponse {
  assigned: number;
  skippedIds: number[];
  alreadyAssigned: number[];
}

export interface AssessmentDTO {
  id: number;
  title: string;
  type: AssessmentType;
  description?: string;
  scheduledAt?: string;
  videoLink?: string;
  problemStatement?: string;
  timeLimitMinutes?: number;
  createdAt: string;
  questions?: QuestionDTO[];
}

export interface QuestionDTO {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswerIndex: number;
}

export interface ResultDTO {
  studentAssessmentId: number;
  studentName: string;
  studentEmail: string;
  status: AssessmentStatus;
  score?: number;
  total?: number;
  solutionText?: string;
  scheduledAt?: string;
  submittedAt?: string;
}

export interface UpdateStatusRequest {
  status: AssessmentStatus;
}
