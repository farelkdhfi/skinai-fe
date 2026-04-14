# 🚀 SkinAI – Intelligent Skin Analysis System

SkinAI adalah sistem analisis kondisi kulit wajah berbasis deep learning yang mengintegrasikan:

- **Patch-Based Learning**
- **MobileNetV2 (Transfer Learning)**
- **Explainable AI (Grad-CAM)**
- **Smart Camera Guidance (MediaPipe)**
- **K-Means Clustering Recommendation System**

> 📌 Proyek ini dikembangkan sebagai implementasi dari penelitian Tugas Akhir.

---

# 📚 Research Overview

Penelitian ini bertujuan mengembangkan sistem analisis kulit berbasis web dengan pendekatan terintegrasi yang mencakup:

1. Klasifikasi berbasis **Region of Interest (ROI)**
2. Transparansi model melalui **Explainable AI**
3. Validasi kualitas citra secara real-time
4. Sistem rekomendasi berbasis **Clustering**

---

# 🧠 Core Methodology

## 🔹 1. Patch-Based Learning

Alih-alih menggunakan seluruh wajah sebagai input, sistem membagi wajah menjadi beberapa **Region of Interest (ROI)**:

- Forehead  
- Cheeks  
- Nose  

Setiap patch diproses secara independen menggunakan model CNN, kemudian hasilnya diagregasi untuk menghasilkan prediksi akhir.

**Tujuan pendekatan ini:**
- Mengurangi noise area non-kulit
- Meningkatkan sensitivitas terhadap mikro-tekstur
- Meningkatkan robustness model

---

## 🔹 2. MobileNetV2 (Transfer Learning)

Model klasifikasi menggunakan arsitektur **MobileNetV2** karena:

- Lightweight
- Efisien untuk deployment berbasis web
- Mendukung transfer learning
- Stabil untuk klasifikasi citra

Output model berupa **probabilitas prediksi**.

---

## 🔹 3. Explainable AI – Grad-CAM

Sistem mengintegrasikan **Gradient-weighted Class Activation Mapping (Grad-CAM)** untuk:

- Memvisualisasikan area citra yang memengaruhi prediksi
- Meningkatkan transparansi keputusan model
- Mendukung interpretabilitas model

Grad-CAM diterapkan pada level patch.

---

## 🔹 4. Smart Camera Guidance

Menggunakan **MediaPipe Face Landmarker** untuk melakukan validasi citra sebelum analisis dilakukan.

Validasi meliputi:

- Cakupan wajah (face coverage)
- Orientasi wajah
- Distribusi pencahayaan

Proses ini dilakukan di sisi client untuk menjaga kualitas input sebelum dikirim ke server.

---

## 🔹 5. Recommendation System (K-Means Clustering)

Sistem rekomendasi menggunakan **K-Means Clustering** untuk mengelompokkan bahan aktif skincare berdasarkan kesamaan fungsional.

Pendekatan ini memungkinkan:

- Rekomendasi bahan utama
- Alternatif bahan dengan fungsi serupa
- Sistem yang lebih fleksibel dibanding rule-based mapping

Jumlah cluster ditentukan menggunakan metode seperti:

- Elbow Method  
- Silhouette Analysis  

---

# 🏗️ System Architecture

## 🖥️ Client-Side

- MediaPipe Landmark Detection  
- Validasi kualitas citra  
- Ekstraksi patch ROI  

## 🗄️ Server-Side

- Preprocessing citra  
- Inferensi MobileNetV2  
- Generasi Grad-CAM  
- Aggregasi hasil patch  
- Rekomendasi berbasis clustering  

---

# 🔄 System Flow

1. User melakukan capture atau upload citra.
2. MediaPipe melakukan validasi kualitas citra.
3. ROI diekstraksi menjadi beberapa patch.
4. Patch dikirim ke server untuk inferensi.
5. Model menghasilkan probabilitas klasifikasi.
6. Grad-CAM menghasilkan visualisasi area fokus.
7. Sistem menghasilkan rekomendasi berbasis clustering.

---

# 📊 Evaluation Metrics

Model klasifikasi dievaluasi menggunakan:

- Accuracy  
- Precision  
- Recall  
- F1-Score  
- AUC  

Evaluasi tambahan mencakup:

- Validasi visual Grad-CAM
- Evaluasi sistem rekomendasi
- Evaluasi pengalaman pengguna

---

# 🛠️ Tech Stack

## 🎨 Frontend
- React 18  
- Tailwind CSS  
- MediaPipe  

## ⚙️ Backend
- Python  
- MobileNetV2  
- Grad-CAM  
- K-Means Clustering  

---

# 🚀 Getting Started

## 📦 Prerequisites

- Node.js (v16+)
- Python environment (untuk backend)

---

## 🔧 Frontend Setup

```bash
git clone https://github.com/farelkdhfi/skinai-frontend.git
cd skin-ai-analysis
npm install
npm run dev
