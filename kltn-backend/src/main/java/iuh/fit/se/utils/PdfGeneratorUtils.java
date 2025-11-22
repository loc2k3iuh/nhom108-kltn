package iuh.fit.se.utils;

import com.lowagie.text.Document;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfCopy;
import com.lowagie.text.pdf.PdfReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Slf4j
public class PdfGeneratorUtils {

  /**
   * Generates a PDF from HTML content
   *
   * @param htmlContent HTML content to convert to PDF
   * @return PDF as byte array
   * @throws Exception if PDF generation fails
   */
  public static byte[] generatePdfFromHtml(String htmlContent) throws Exception {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ITextRenderer renderer = new ITextRenderer();

    // Configure font resolver for Vietnamese characters
    try {
      // Add Times New Roman font with proper encoding for Vietnamese
      File timesFont = new File("C:/Windows/Fonts/Times New Roman.ttf");
      if (timesFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(timesFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      } else {
        // Try standard Windows filename
        File timesStdFont = new File("C:/Windows/Fonts/times.ttf");
        if (timesStdFont.exists()) {
          renderer
              .getFontResolver()
              .addFont(timesStdFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        } else {
          log.warn("Times New Roman font not found at any expected location");
        }
      }

      // Add Times New Roman Bold for headings
      File timesBoldFont =
          new File(
              "C:/Windows/Fonts/timesbd.ttf"); // Standard Windows filename for Times New Roman Bold
      if (timesBoldFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(timesBoldFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      } else {
        // Try alternative filename
        File timesBoldAltFont = new File("C:/Windows/Fonts/Times New Roman Bold.ttf");
        if (timesBoldAltFont.exists()) {
          renderer
              .getFontResolver()
              .addFont(timesBoldAltFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        }
      }

      // Add Times New Roman Italic
      File timesItalicFont = new File("C:/Windows/Fonts/timesi.ttf");
      if (timesItalicFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(timesItalicFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      }

      // Add Times New Roman Bold Italic
      File timesBoldItalicFont = new File("C:/Windows/Fonts/timesbi.ttf");
      if (timesBoldItalicFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(timesBoldItalicFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      }

      File arialFont = new File("C:/Windows/Fonts/Arial.ttf");
      if (arialFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(arialFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      }

      File tahomaFont = new File("C:/Windows/Fonts/Tahoma.ttf");
      if (tahomaFont.exists()) {
        renderer
            .getFontResolver()
            .addFont(tahomaFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
      }
    } catch (Exception e) {
      log.error("Error loading fonts: {}", e.getMessage(), e);
    }

    // Update CSS to explicitly set font-family for Vietnamese text
    // First try with double quotes
    String modifiedHtmlContent =
        htmlContent.replace(
            "font-family: \"Times New Roman\", sans-serif;",
            "font-family: \"Times New Roman\"; font-language-override: normal;");

    // Also try with single quotes in case the HTML uses those
    modifiedHtmlContent =
        modifiedHtmlContent.replace(
            "font-family: 'Times New Roman', sans-serif;",
            "font-family: 'Times New Roman'; font-language-override: normal;");

    // Add meta tag for Vietnamese character encoding if not already present
    if (!modifiedHtmlContent.contains("<meta charset=\"UTF-8\"")) {
      modifiedHtmlContent =
          modifiedHtmlContent.replace("<head>", "<head>\n<meta charset=\"UTF-8\"/>");
    }

    // Add specific CSS for Vietnamese text
    if (!modifiedHtmlContent.contains("@font-face")) {
      String fontFaceCSS =
          "<style>\n"
              + "@font-face {\n"
              + "  font-family: 'Times New Roman';\n"
              + "  src: local('Times New Roman');\n"
              + "  font-weight: normal;\n"
              + "  font-style: normal;\n"
              + "}\n"
              + "body {\n"
              + "  font-family: 'Times New Roman', serif;\n"
              + "}\n"
              + "</style>";

      modifiedHtmlContent = modifiedHtmlContent.replace("</head>", fontFaceCSS + "\n</head>");
    }

    renderer.setDocumentFromString(modifiedHtmlContent);
    renderer.layout();
    renderer.createPDF(baos);

    return baos.toByteArray();
  }

  /**
   * Generates multiple PDFs from a list of HTML contents
   *
   * @param htmlContents List of HTML contents to convert to PDFs
   * @return List of PDFs as byte arrays
   * @throws Exception if PDF generation fails
   */
  public static List<byte[]> generatePdfsFromHtmlList(List<String> htmlContents) throws Exception {
    List<byte[]> pdfList = new ArrayList<>();
    for (String htmlContent : htmlContents) {
      byte[] pdf = generatePdfFromHtml(htmlContent);
      pdfList.add(pdf);
    }
    return pdfList;
  }

  /**
   * Merges multiple PDFs into a single PDF
   *
   * @param pdfBytesList List of PDFs as byte arrays
   * @return Merged PDF as byte array
   * @throws Exception if PDF merging fails
   */
  public static byte[] mergePdfs(List<byte[]> pdfBytesList) throws Exception {
    if (pdfBytesList == null || pdfBytesList.isEmpty()) {
      throw new IllegalArgumentException("PDF list cannot be null or empty");
    }

    // If there's only one PDF, return it directly
    if (pdfBytesList.size() == 1) {
      return pdfBytesList.get(0);
    }

    ByteArrayOutputStream mergedPdfOutputStream = new ByteArrayOutputStream();
    Document document = new Document();
    PdfCopy copy = new PdfCopy(document, mergedPdfOutputStream);
    document.open();

    try {
      for (byte[] pdfBytes : pdfBytesList) {
        PdfReader reader = new PdfReader(pdfBytes);
        int numPages = reader.getNumberOfPages();

        for (int pageNum = 1; pageNum <= numPages; pageNum++) {
          copy.addPage(copy.getImportedPage(reader, pageNum));
        }

        copy.freeReader(reader);
        reader.close();
      }
    } finally {
      if (document.isOpen()) {
        document.close();
      }
    }

    return mergedPdfOutputStream.toByteArray();
  }
}
