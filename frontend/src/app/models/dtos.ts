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
  planName: string;
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'NOT_PAID' | 'PARTIAL' | 'FULL';
}
