<template>
  <div class="pdf-viewer-container">
    <div class="pdf-viewer-wrapper">
      <!-- Header with Buttons -->
      <div class="pdf-viewer-header">
        <button
          class="pdf-download-btn"
          :disabled="!pdfUrl"
          @click="downloadFile"
          :style="{ backgroundColor: downloadColor }"
        >
          Download
        </button>
        <button
          class="pdf-preview-btn"
          :disabled="!pdfUrl"
          @click="togglePreview"
        >
          Preview
        </button>
      </div>

      <!-- Canvas Container -->
      <div class="pdf-preview-wrapper" :style="{ width, height }">
        <div class="pdf-canvas-container">
          <canvas
            ref="canvasRef"
            class="pdf-canvas"
            :style="{ border: borderStyle }"
          ></canvas>

          <div v-if="isLoading" class="pdf-loading-spinner">
            <div class="spinner"></div>
          </div>
        </div>
      </div>

      <!-- Navigation (Below Canvas) -->
      <div v-if="pdfUrls.length > 1" class="pdf-navigator">
        <button
          class="pdf-nav-btn"
          @click="prevFile"
          :disabled="currentIndex === 0"
        >
          ‹
        </button>

        <span class="pdf-page-counter">
          {{ currentIndex + 1 }} / {{ pdfUrls.length }}
        </span>

        <button
          class="pdf-nav-btn"
          @click="nextFile"
          :disabled="currentIndex === pdfUrls.length - 1"
        >
          ›
        </button>
      </div>

      <!-- Message pr erreur -->
      <div v-if="errorMessage" class="pdf-error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, ref } from "vue";
import { usePdfPreview } from "../composables/usePdf";

const props = defineProps<{
  pdfUrls: string[];
  width?: string;           // "100%", "600px"
  height?: string;          // "400px"
  border?: boolean;         // show border
  borderColor?: string;     // border color
  borderWidth?: string;     // border width (e.g., "2px")
  downloadColor?: string;   // button color
  backgroundColor?: string; // canvas background
}>();

const width = props.width ?? "100%";
const height = props.height ?? "350px";
const borderColor = props.borderColor ?? "#ddd";
const borderWidth = props.borderWidth ?? "1px";
const borderStyle = props.border ? `${borderWidth} solid ${borderColor}` : "none";
const downloadColor = props.downloadColor ?? "#007bff";
// const backgroundColor = props.backgroundColor ?? "#ffffff";

const canvasRef = ref<HTMLCanvasElement | null>(null);

const {
  currentIndex,
  pdfUrl,
  isLoading,
  errorMessage,
  renderPdf,
  nextFile,
  prevFile,
  downloadFile
} = usePdfPreview(props.pdfUrls, canvasRef);

const togglePreview = () => {
  // Ouvrir le PDF dans un nouvel onglet
  if (pdfUrl.value) {
    window.open(pdfUrl.value, '_blank');
  }
};

const handleResize = () => {
  renderPdf();
};

onMounted(async () => {
  if (props.pdfUrls.length) {
    await nextTick();
    renderPdf();
  }
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  height: 100%;
}

.pdf-viewer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  /* background-color: #f5f5f5; */
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pdf-viewer-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.pdf-viewer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.pdf-download-btn {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pdf-download-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.pdf-download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pdf-preview-btn {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pdf-preview-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.pdf-preview-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pdf-preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.pdf-canvas-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.pdf-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pdf-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pdf-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pdf-nav-btn {
  padding: 6px 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  background-color: #e9ecef;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 36px;
}

.pdf-nav-btn:hover:not(:disabled) {
  background-color: #dee2e6;
  border-color: #adb5bd;
}

.pdf-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pdf-page-counter {
  font-size: 14px;
  color: #666;
  min-width: 80px;
  text-align: center;
}

.pdf-error-message {
  padding: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
  font-size: 14px;
}
</style>