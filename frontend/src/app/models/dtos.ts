export interface InternshipApplicationDTO {
  studentName: string;
  email: string;
  phone: string;
  internshipType: string;
  message?: string;
}

export interface CourseEnrollmentDTO {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  message?: string;
}

export interface ContactMessageDTO {
  name: string;
  email: string;
  message: string;
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
