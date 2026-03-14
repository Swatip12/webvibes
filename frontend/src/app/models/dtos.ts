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
