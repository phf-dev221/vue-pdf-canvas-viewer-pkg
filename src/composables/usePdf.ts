import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export function usePdfPreview(pdfUrls: string[], canvasRef: Ref<HTMLCanvasElement | null>) {

  const currentIndex = ref(0);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const pdfUrl = computed(() => pdfUrls[currentIndex.value]);

  const renderPdf = async () => {
    if (!pdfUrl.value || !canvasRef.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const pdf = await getDocument(pdfUrl.value).promise;
      const page = await pdf.getPage(1);

      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Get parent dimensions
      const parent = canvas.parentElement;
      if (!parent) return;

      const parentWidth = parent.offsetWidth;
      const parentHeight = parent.offsetHeight;

      // If parent has no dimensions yet, wait a bit and retry
      if (parentWidth === 0 || parentHeight === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return renderPdf();
      }

      // Calculate scale to fit within parent
      const baseViewport = page.getViewport({ scale: 1 });
      const scaleX = parentWidth / baseViewport.width;
      const scaleY = parentHeight / baseViewport.height;
      const scale = Math.min(scaleX, scaleY, 2); // Cap at 2x to avoid huge canvases

      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        canvas,
        viewport
      }).promise;
    } catch (e) {
      console.error(e);
      errorMessage.value = "Erreur lors du chargement du document";
    } finally {
      isLoading.value = false;
    }
  };

  const nextFile = () => {
    if (currentIndex.value < pdfUrls.length - 1) {
      currentIndex.value++;
    }
  };

  const prevFile = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const downloadFile = () => {
    if (!pdfUrl.value) return;
    const link = document.createElement("a");
    link.href = pdfUrl.value;
    link.download = `document${currentIndex.value + 1}.pdf`;
    link.click();
  };

  watch(pdfUrl, renderPdf);

  return {
    currentIndex,
    pdfUrl,
    isLoading,
    errorMessage,
    renderPdf,
    nextFile,
    prevFile,
    downloadFile
  };
}
