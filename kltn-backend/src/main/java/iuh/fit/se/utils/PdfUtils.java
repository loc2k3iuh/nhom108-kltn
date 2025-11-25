package iuh.fit.se.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.MemoryUsageSetting;
import org.apache.pdfbox.multipdf.PDFMergerUtility;

/** Utility class for PDF operations such as merging multiple PDFs into one. */
@Slf4j
public final class PdfUtils {

  private PdfUtils() {
    // Private constructor to prevent instantiation
  }

  /**
   * Merge multiple PDF files (provided as byte arrays) into a single PDF.
   *
   * @param pdfBytesList list of PDF file contents as byte[]
   * @return merged PDF as byte[]
   * @throws IOException on IO errors during merging
   */
  public static byte[] mergePdfBytes(List<byte[]> pdfBytesList) throws IOException {
    if (pdfBytesList == null || pdfBytesList.isEmpty()) {
      log.warn("No PDF files provided for merging");
      return new byte[0];
    }

    PDFMergerUtility merger = new PDFMergerUtility();
    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
      // Add each PDF to the merger
      for (int i = 0; i < pdfBytesList.size(); i++) {
        byte[] pdfBytes = pdfBytesList.get(i);
        if (pdfBytes == null || pdfBytes.length == 0) {
          log.warn("Skipping empty PDF at index {}", i);
          continue;
        }
        merger.addSource(new ByteArrayInputStream(pdfBytes));
        log.debug("Added PDF {} to merger ({} bytes)", i + 1, pdfBytes.length);
      }

      // Set output stream and merge
      merger.setDestinationStream(outputStream);
      merger.mergeDocuments(MemoryUsageSetting.setupMainMemoryOnly());

      byte[] mergedPdf = outputStream.toByteArray();
      log.info(
          "Successfully merged {} PDFs into one ({} bytes)", pdfBytesList.size(), mergedPdf.length);

      return mergedPdf;
    } catch (IOException e) {
      log.error("Error merging PDF files", e);
      throw e;
    }
  }
}
