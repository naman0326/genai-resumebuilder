import axios from "axios";

// api layer
// communicating with the interview backend apis

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// resume is a PDF File, so this is sent as multipart/form-data
export async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  if (resume) {
    formData.append("resume", resume);
  }

  const response = await api.post("/api/interview", formData);

  return response.data;
}
